import {
  implementPlaylistQuery,
  implementSingerQuery,
  implementSongQuery,
} from "@/services/appService";
import {
  getSearchQuery,
  playlistCollectionRef,
  singerCollectionRef,
  songsCollectionRef,
} from "@/services/firebaseService";
import { sleep } from "@/utils/appHelpers";
import { limit, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const tabs = ["All", "Song", "Playlist", "Singer"] as const;

type Tab = (typeof tabs)[number];

const initResult = {
  songs: [] as Song[],
  playlists: [] as Playlist[],
  singers: [] as Singer[],
};

export default function useGetSearchResult() {
  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState<Tab>("All");

  const searchParams = useSearchParams();

  const [result, setResult] = useState<typeof initResult>(initResult);

  const shouldGetAll = useRef(true);

  const shouldGetSongs = useRef(true);

  const shouldGetPlaylists = useRef(true);

  const shouldGetSingers = useRef(true);

  const updateResult = (data: Partial<typeof initResult>) => {
    setResult((prev) => ({ ...prev, ...data }));
  };

  const getResult = async () => {
    try {
      const key = searchParams[0].get("q");

      if (!key) return;

      setIsFetching(true);


      await sleep(500)

      switch (tab) {
        case "All": {
          if (!shouldGetAll.current) return;
          shouldGetAll.current = false;

          const [songs, playlists, singers] = await Promise.all([
            implementSongQuery(
              getSearchQuery(
                songsCollectionRef,
                [where("is_official", "==", true), limit(6)],
                key,
              ),
            ),
            implementPlaylistQuery(
              getSearchQuery(playlistCollectionRef, [limit(3)], key),
            ),
            implementSingerQuery(
              getSearchQuery(singerCollectionRef, [limit(3)], key),
            ),
          ]);

          updateResult({ playlists, songs, singers });

          break;
        }

        case "Song": {
          if (!shouldGetSongs.current) return;
          shouldGetSongs.current = false;

          const q = getSearchQuery(
            songsCollectionRef,
            [where("is_official", "==", true)],
            key,
          );
          const songs = await implementSongQuery(q);

          updateResult({ songs });

          break;
        }
        case "Playlist": {
          if (!shouldGetPlaylists.current) return;
          shouldGetPlaylists.current = false;

          const q = getSearchQuery(
            playlistCollectionRef,
            [where("is_public", "==", true)],
            key,
          );

          const playlists = await implementPlaylistQuery(q);

          updateResult({ playlists });

          break;
        }
        case "Singer": {
          if (!shouldGetSingers.current) return;
          shouldGetSingers.current = false;

          const q = getSearchQuery(singerCollectionRef, [], key);

          const singers = await implementSingerQuery(q);

          updateResult({ singers });

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  // run get result
  useEffect(() => {
    getResult();
  }, [searchParams[0].get("q"), tab]);

  // reset tab
  useEffect(() => {
    return () => {
      setTab("All");

      shouldGetAll.current = true;
      shouldGetSongs.current = true;
      shouldGetPlaylists.current = true;
      shouldGetSingers.current = true;
    };
  }, [searchParams[0].get("q")]);

  return {
    isFetching,
    setIsFetching,
    tab,
    setTab,
    getResult,
    result,
    tabs,
  };
}
