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
import { convertToEn } from "@/utils/appHelpers";
import {
  CollectionReference,
  QueryConstraint,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const tabs = ["Song", "Playlist", "Singer"] as const;

type Tab = (typeof tabs)[number];

const initResult = {
  songs: [] as Song[],
  playlists: [] as Playlist[],
  singers: [] as Singer[],
  users: [] as User[],
};

export default function useGetSearchResult() {
  const [isFetching, setIsFetching] = useState(false);
  const [tab, setTab] = useState<Tab>("Song");

  const searchParams = useSearchParams();

  const [result, setResult] = useState<typeof initResult>(initResult);

  const updateResult = (data: Partial<typeof initResult>) => {
    setResult((prev) => ({ ...prev, ...data }));
  };

  const getQuery = (
    collectionRef: CollectionReference,
    contraints: QueryConstraint[],
  ) => {
    const key = searchParams[0].get("q");

    const lowValue = convertToEn(key?.trim() || "");
    const capitalizedString =
      lowValue.charAt(0).toUpperCase() + lowValue.slice(1);

    const searchQuery =
      lowValue.split(" ").length > 1
        ? query(
            collectionRef,

            ...contraints,
            where("meta", "array-contains-any", lowValue.split(" ")),
          )
        : query(
            collectionRef,
            ...contraints,

            where("name", ">=", capitalizedString),
            where("name", "<=", capitalizedString + "\uf8ff"),
          );

    return searchQuery;
  };

  const getResult = async () => {
    try {
      const key = searchParams[0].get("q");

      if (!key) return;

      switch (tab) {
        case "Song": {
          const q = getQuery(songsCollectionRef, [
            where("is_official", "==", true),
          ]);
          const result = await implementSongQuery(q);

          updateResult({ songs: result });

          break;
        }
        case "Playlist": {
          const q = getQuery(playlistCollectionRef, []);

          const result = await implementPlaylistQuery(q);

          updateResult({ playlists: result });

          break;
        }
        case "Singer": {
          const q = getQuery(singerCollectionRef, []);

          const result = await implementSingerQuery(q);

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
