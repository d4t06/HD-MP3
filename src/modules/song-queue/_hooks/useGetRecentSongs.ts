import { implementSongQuery } from "@/services/appService";
import { myUpdateDoc, songsCollectionRef } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useState } from "react";

export default function useGetRecentSong() {
  const { user, updateUserData } = useAuthContext();

  const [recentSongs, setRecentSongs] = useState<Song[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  const getRecentSongs = async () => {
    try {
      if (user) {
        if (user.recent_song_ids.length) {
          const queryGetRecentSongs = query(
            songsCollectionRef,
            where(documentId(), "in", user.recent_song_ids),
          );

          const result = await implementSongQuery(queryGetRecentSongs);

          const orderedSongs: Song[] = [];

          user.recent_song_ids.forEach((id) => {
            const founded = result.find((c) => c.id === id);
            if (founded) orderedSongs.push(founded);
          });

          setRecentSongs(orderedSongs);
        }
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

  const clearRecentSongs = async () => {
    if (!user) return;

    setRecentSongs([]);

    const newUserData: Partial<User> = {
      recent_song_ids: [],
    };

    await myUpdateDoc({
      collectionName: "Users",
      data: newUserData,
      id: user.email,
    });

    updateUserData(newUserData);
  };

  return { isFetching, recentSongs, getRecentSongs, clearRecentSongs };
}
