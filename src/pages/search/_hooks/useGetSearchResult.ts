import {
  implementPlaylistQuery,
  implementSingerQuery,
  implementSongQuery,
} from "@/services/appService";
import {
  playlistCollectionRef,
  singerCollectionRef,
  songsCollectionRef,
} from "@/services/firebaseService";
import { query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const tabs = ["Song", "Playlist", "Singers"] as const;

type Tab = (typeof tabs)[number];

const initResult = {
  songs: [] as Song[],
  playlists: [] as Playlist[],
  singers: [] as Singer[],
};

export default function useGetSearchResult() {
  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState<Tab>("Song");

  const searchParams = useSearchParams();

  const [result, setResult] = useState<typeof initResult>(initResult);

  const updateResult = (data: Partial<typeof initResult>) => {
    setResult((prev) => ({ ...prev, ...data }));
  };

  const getResult = async () => {
    try {
      const key = searchParams[0].get("q");

      if (!key) return;

      switch (tab) {
        case "Song": {
          const searchQuery = query(
            songsCollectionRef,
            where("is_official", "==", true),
            where("name", ">=", key),
            where("name", "<=", key + "\uf8ff"),
          );

          const result = await implementSongQuery(searchQuery);

          updateResult({ songs: result });

          break;
        }
        case "Playlist": {
          const searchQuery = query(
            playlistCollectionRef,
            where("is_public", "==", true),
            where("name", ">=", key),
            where("name", "<=", key + "\uf8ff"),
          );

          const result = await implementPlaylistQuery(searchQuery);

          updateResult({ playlists: result });

          break;
        }
        case "Singers": {
          const searchQuery = query(
            singerCollectionRef,
            where("name", ">=", key),
            where("name", "<=", key + "\uf8ff"),
          );

          const result = await implementSingerQuery(searchQuery);

          updateResult({ singers: result });

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
      // else shouldUpdateResult.current = true;
    }
  };

  // run get result
  useEffect(() => {
    getResult();

    return () => {
      setIsFetching(true);
    };
  }, [searchParams[0].get("q"), tab]);

  // reset tab
  useEffect(() => {
    return () => {
      setTab("Song");
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
