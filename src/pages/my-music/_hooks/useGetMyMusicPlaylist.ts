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

        const queryGetUserPlaylist = query(
          playlistCollectionRef,
          where(documentId(), "in", user.liked_playlist_ids)
        );

        const result = await implementPlaylistQuery(queryGetUserPlaylist);

        const showAblePlaylist = result.filter((p) => {
          const isOwnerOfPlaylist = !p.is_official && p.owner_email === user.email;

          if (isOwnerOfPlaylist) return true;
          else if (p.is_public) return true;
          else return false;
        });

        setPlaylists(showAblePlaylist);
      } else await sleep(100);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, playlists, user, setIsFetching, getPlaylist };
}
