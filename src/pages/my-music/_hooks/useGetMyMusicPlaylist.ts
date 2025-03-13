import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useState } from "react";

// this hook not in useEffect
export default function useGetMyMusicPlaylist() {
  const { user } = useAuthContext();
  const { setPlaylists, shouldFetchUserPlaylists, playlists } = useSongContext();

  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const getPlaylist = async () => {
    try {
      if (!user) return;

      setIsFetching(true);

      if (shouldFetchUserPlaylists.current) {
        shouldFetchUserPlaylists.current = false;

        if (user.liked_playlist_ids.length) {
          const queryGetUserPlaylist = query(
            playlistCollectionRef,
            where(documentId(), "in", user.liked_playlist_ids),
            where("is_public", "==", true)
          );

          const result = await implementPlaylistQuery(queryGetUserPlaylist);
          setPlaylists(result);
        }
      } else await sleep(100);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  // useEffect(() => {
  //   if (!user) return;
  //   getPlaylist();
  // }, [user]);

  return { isFetching, playlists, user, setIsFetching, getPlaylist };
}
