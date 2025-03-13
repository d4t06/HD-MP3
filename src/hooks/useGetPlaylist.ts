import { useNavigate, useParams } from "react-router-dom";
import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { PlaylistParamsType } from "../routes";
import { useDispatch } from "react-redux";
import { useAuthContext, useToastContext } from "../stores";
import { useEffect, useRef, useState } from "react";
import { documentId, getDocs, query, where } from "firebase/firestore";
import {
  resetCurrentPlaylist,
  setCurrentPlaylist,
} from "@/stores/redux/currentPlaylistSlice";
import { nanoid } from "nanoid";

export default function useGetPlaylist() {
  // stores
  const dispatch = useDispatch();
  const { setErrorToast } = useToastContext();
  const { user } = useAuthContext();

  // hooks
  const params = useParams<PlaylistParamsType>();
  const navigator = useNavigate();

  // state
  const ranEffect = useRef(false);
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

  const getSongs = async (playlist: Playlist) => {
    if (!playlist.song_ids.length) return [];

    const queryGetSongs = query(
      songsCollectionRef,
      where(documentId(), "in", playlist.song_ids)
    );
    const songsSnap = await getDocs(queryGetSongs);

    if (songsSnap.docs.length) {
      const songs = songsSnap.docs.map((doc) => {
        const song: Song = {
          id: doc.id,
          ...(doc.data() as SongSchema),
          queue_id: `${nanoid(4)}_${playlist.id}}`,
        };

        return song;
      });

      return songs;
    }

    return [];
  };

  const init = async () => {
    try {
      if (!params.id) return;

      setIsFetching(true);

      const playlist = await getPlaylist();
      if (!playlist) return;

      const isOwnerOfPlaylist = user
        ? playlist.owner_email === user.email && !playlist.is_official
        : false;

      if (!isOwnerOfPlaylist && !playlist.is_public) return navigator("/");

      const playlistSongs = await getSongs(playlist);

      dispatch(
        setCurrentPlaylist({
          playlist: playlist,
          songs: playlistSongs,
        })
      );
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      init();
    }

    return () => {
      dispatch(resetCurrentPlaylist());
    };
  }, []);

  return { isFetching };
}
