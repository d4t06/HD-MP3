import { implementSongQuery } from "@/services/appService";
import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { documentId, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlaylistContext } from "../PlaylistContext";

export default function useGetPlaylist() {
  const [isFetching, setIsFetching] = useState(true);

  const { setSongs, setPlaylist } = usePlaylistContext();

  const ranEffect = useRef(false);

  const params = useParams();
  const navigator = useNavigate();

  const { setErrorToast } = useToastContext();

  const getPlaylist = async () => {
    try {
      if (!params.id) return;

      const docRef = await myGetDoc({
        collectionName: "Playlists",
        id: params.id,
        msg: "useGetPlaylist, get playlist doc",
      });

      if (!docRef.exists()) return navigator("/dashboard/playlist");

      const playlist: Playlist = {
        ...(docRef.data() as PlaylistSchema),
        id: docRef.id,
      };

      if (!playlist.is_official) return navigator("/dashboard/playlist");

      if (playlist.song_ids.length) {
        const queryGetSongs = query(
          songsCollectionRef,
          where(documentId(), "in", playlist.song_ids),
        );

        const result = await implementSongQuery(queryGetSongs);
        setSongs(result);
      }

      setPlaylist(playlist);
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getPlaylist();
    }
  }, []);

  return { isFetching };
}
