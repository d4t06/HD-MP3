import { useParams } from "react-router-dom";
import { getSongInList, myGetDoc } from "@/services/firebaseService";
import { PlaylistParamsType } from "../routes";
import { useDispatch } from "react-redux";
import { useAuthContext, useToastContext } from "../stores";
import { useEffect, useRef, useState } from "react";
import {
  resetCurrentPlaylist,
  setCurrentPlaylist,
} from "@/stores/redux/currentPlaylistSlice";

export default function useGetPlaylist() {
  // stores
  const dispatch = useDispatch();
  const { setErrorToast } = useToastContext();
  const { user, loading } = useAuthContext();

  const ranEffect = useRef(false);

  // hooks
  const params = useParams<PlaylistParamsType>();

  // state
  const [isFetching, setIsFetching] = useState(true);

  const getPlaylist = async () => {
    if (!params.id) return;

    const playlistSnap = await myGetDoc({
      collectionName: "Playlists",
      id: params.id,
      msg: ">>> api get playlist",
    });

    if (playlistSnap.exists()) {
      const playlist: Playlist = {
        ...(playlistSnap.data() as PlaylistSchema),
        id: playlistSnap.id,
      };

      return playlist;
    }
  };

  const getPlaylistData = async () => {
    try {
      if (!params.id) return;

      setIsFetching(true);

      const playlist = await getPlaylist();
      if (!playlist) return;

      const isOwnerOfPlaylist = user
        ? playlist.owner_email === user.email && !playlist.is_official
        : false;

      if (!isOwnerOfPlaylist && !playlist.is_public) return;

      const playlistSongs = await getSongInList(playlist.song_ids, playlist.id);

      dispatch(
        setCurrentPlaylist({
          playlist: playlist,
          songs: playlistSongs,
        }),
      );
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!ranEffect.current) {
      ranEffect.current = true;
      getPlaylistData();
    }

    return () => {
      dispatch(resetCurrentPlaylist());
    };
  }, [loading]);

  return { isFetching };
}
