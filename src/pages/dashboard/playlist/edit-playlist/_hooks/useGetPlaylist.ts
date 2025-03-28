import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { usePlaylistContext } from "@/stores/dashboard/PlaylistContext";
import { Query, documentId, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

async function implementQuery(query: Query) {
  const songsSnap = await getDocs(query);

  if (songsSnap.docs) {
    const result = songsSnap.docs.map((doc) => {
      const song: Song = { ...(doc.data() as SongSchema), id: doc.id, queue_id: "" };
      return song;
    });

    return result;
  } else return [];
}

export default function useGetPlaylist() {
  const [isFetching, setIsFetching] = useState(true);

  const { setSongs, setPlaylist, playlist, songs } = usePlaylistContext();

  const ranEffect = useRef(false);

  const params = useParams();
  const navigator = useNavigate()

  const { setErrorToast } = useToastContext();

  const getPlaylist = async () => {
    try {
      if (!params.id) return;

      const docRef = await myGetDoc({ collectionName: "Playlists", id: params.id });

      if (!docRef.exists()) return navigator("/dashboard/playlist")

      const playlist: Playlist = {
        ...(docRef.data() as PlaylistSchema),
        id: docRef.id,
      };

      if (playlist.song_ids.length) {
        const queryGetSongs = query(
          songsCollectionRef,
          where(documentId(), "in", playlist.song_ids),
        );

        const result = await implementQuery(queryGetSongs);
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

  return { songs, playlist, isFetching };
}
