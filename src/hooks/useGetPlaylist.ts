import { useParams } from "react-router-dom";
import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { PlaylistParamsType } from "../routes";
import { useDispatch } from "react-redux";
import { useAuthContext, useToastContext } from "../stores";
import { useEffect, useRef, useState } from "react";
import { documentId, query, where } from "firebase/firestore";
import {
  resetCurrentPlaylist,
  setCurrentPlaylist,
} from "@/stores/redux/currentPlaylistSlice";
import { implementSongQuery } from "@/services/appService";
import { nanoid } from "nanoid";

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

  const getSongs = async (playlist: Playlist) => {
    if (!playlist.song_ids.length) return [];

    const chunkSize = 20;
    const chunks = [];
    for (let i = 0; i < playlist.song_ids.length; i += chunkSize) {
      chunks.push(playlist.song_ids.slice(i, i + chunkSize));
    }

    const playlistSongs: Song[] = [];

    if (import.meta.env.DEV) console.log(chunks.length, "chunks");

    for (const chunk of chunks) {
      if (chunk.length > 0) {
        const queryGetSongs = query(
          songsCollectionRef,
          where(documentId(), "in", chunk),
        );

        const result = await implementSongQuery(queryGetSongs, {
          msg: "get playlist songs",
          getQueueId: () => `${playlist.id}_${nanoid(4)}`
        });

        playlistSongs.push(...result);
      }
    }

    return playlistSongs;
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
