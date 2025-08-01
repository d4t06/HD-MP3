import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useState } from "react";

export default function useGetRecentPlaylist() {
  const { user } = useAuthContext();

  const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  const getRecentPlaylist = async () => {
    try {
      if (user) {
        if (user.recent_playlist_ids.length) {
          const queryGetRecentPlaylists = query(
            playlistCollectionRef,
            where(documentId(), "in", user.recent_playlist_ids),
          );

          const result = await implementPlaylistQuery(queryGetRecentPlaylists);

          setRecentPlaylists(result);
        }
      } else {
        const playlists: Playlist[] =
          getLocalStorage()["recent-playlists"] || [];
        setRecentPlaylists(playlists);
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, recentPlaylists, getRecentPlaylist };
}
