import { useParams } from "react-router-dom";
import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { PlaylistParamsType } from "../routes";
import { useDispatch } from "react-redux";
import { useToastContext } from "../stores";
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

  // hooks
  const params = useParams<PlaylistParamsType>();
  const { setErrorToast } = useToastContext();

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

    if (playlistSnap.exists()) return playlistSnap.data() as Playlist;
  };

  const getSongs = async (playlist: Playlist) => {
    if (!playlist.song_ids.length) return [];

    const queryGetSongs = query(
      songsCollectionRef,
      where(documentId(), "in", playlist.song_ids),
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

      const playlistSongs = await getSongs(playlist);

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
