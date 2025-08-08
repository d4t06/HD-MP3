import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { getLocalStorage, sleep } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

const tabs = ["Favorite", "Own"] as const;
type Tab = (typeof tabs)[number];

export default function useGetMyMusicPlaylist() {
  const { user } = useAuthContext();
  const {
    setOwnPlaylists,
    shouldFetchOwnPlaylists,
    setFavoritePlaylists,
    shouldFetchFavoritePlaylists,
  } = useSongContext();

  const [tab, setTab] = useState<Tab | "">("");

  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const ranEffect = useRef(false);

  const getPlaylist = async (t?: Tab) => {
    try {
      if (!user) return;

      const _tab = t || tab;

      setIsFetching(true);

      switch (_tab) {
        case "Favorite": {
          if (shouldFetchFavoritePlaylists.current) {
            shouldFetchFavoritePlaylists.current = false;

            if (!user.liked_playlist_ids.length) return;

            const queryGetUserPlaylist = query(
              playlistCollectionRef,
              where(documentId(), "in", user.liked_playlist_ids),
            );

            const result = await implementPlaylistQuery(
              queryGetUserPlaylist,
              "useGetMyMusicPlaylist, get user favorite playlists",
            );

            const showAblePlaylist = result.filter((p) => {
              const isOwnerOfPlaylist =
                !p.is_official && p.owner_email === user.email;

              if (isOwnerOfPlaylist) return true;
              else if (p.is_public) return true;
              else return false;
            });

            setFavoritePlaylists(showAblePlaylist);
          } else await sleep(100);

          break;
        }
        case "Own": {
          if (shouldFetchOwnPlaylists.current) {
            shouldFetchOwnPlaylists.current = false;
            const queryGetUserPlaylist = query(
              playlistCollectionRef,
              where("owner_email", "==", user.email),
              where("is_official", "==", false),
            );
            const result = await implementPlaylistQuery(
              queryGetUserPlaylist,
              "useGetMyMusicPlaylist, get user own playlists",
            );

            setOwnPlaylists(result);
          } else await sleep(100);

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const initRun = async () => {
      const lastTab = getLocalStorage()["last_playlist_tab"] as Tab;

      await getPlaylist(lastTab);
      setTab(lastTab || 'Favorite');
    };

    if (!ranEffect.current) {
      ranEffect.current = true;
      initRun();
    }
  });

  useEffect(() => {
    if (!tab) return;

    getPlaylist();
  }, [tab]);

  return { isFetching, getPlaylist, setIsFetching, tab, setTab, tabs };
}
