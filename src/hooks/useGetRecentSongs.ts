import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useState } from "react";

export default function useGetRecentSong() {
  const { user } = useAuthContext();

  const [recentSongs, setRecentSongs] = useState<Song[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  const getRecentSongs = async () => {
    try {
      if (user && user.recent_song_ids.length) {
        const queryGetRecentSongs = query(
          songsCollectionRef,
          where(documentId(), "in", user.recent_song_ids)
        );

        const result = await implementSongQuery(queryGetRecentSongs);

        setRecentSongs(result);
      } else {
        const songs: Song[] = getLocalStorage()["recent-songs"] || [];
        setRecentSongs(songs);
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, recentSongs, getRecentSongs };
}
