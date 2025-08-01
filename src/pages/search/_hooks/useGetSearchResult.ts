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
import { convertToEn, sleep } from "@/utils/appHelpers";
import {
  CollectionReference,
  QueryConstraint,
  limit,
  query,
  where,
} from "firebase/firestore";
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
  const [tab, setTab] = useState<Tab>("Song");

  const searchParams = useSearchParams();

  const [result, setResult] = useState<typeof initResult>(initResult);

  const shouldGetAll = useRef(true);

  const shoudlGetSongs = useRef(true);

  const shoudlGetPlaylists = useRef(true);

  const shoudlGetSingers = useRef(true);

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

      await sleep(300);

      switch (tab) {
        case "All": {
          if (!shouldGetAll.current) return;
          shouldGetAll.current = false;

          const [songs, playlists, singers] = await Promise.all([
            implementSongQuery(
              getQuery(songsCollectionRef, [
                where("is_official", "==", true),
                limit(6),
              ]),
            ),
            implementPlaylistQuery(getQuery(playlistCollectionRef, [limit(3)])),
            implementSingerQuery(getQuery(singerCollectionRef, [limit(3)])),
          ]);

          updateResult({ playlists, songs, singers });

          break;
        }

        case "Song": {
          if (!shoudlGetSongs.current) return;
          shoudlGetSongs.current = false;

          const q = getQuery(songsCollectionRef, [
            where("is_official", "==", true),
          ]);
          const songs = await implementSongQuery(q);

          updateResult({ songs });

          break;
        }
        case "Playlist": {
          if (!shoudlGetPlaylists.current) return;
          shoudlGetPlaylists.current = false;

          const q = getQuery(playlistCollectionRef, []);

          const playlists = await implementPlaylistQuery(q);

          updateResult({ playlists });

          break;
        }
        case "Singer": {
          if (!shoudlGetSingers.current) return;
          shoudlGetSingers.current = false;

          const q = getQuery(singerCollectionRef, []);

          const singers = await implementSingerQuery(q);

          updateResult({ singers });

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
  }, [searchParams[0].get("q"), tab]);

  // reset tab
  useEffect(() => {
    return () => {
      setTab("All");

      shouldGetAll.current = true;
      shoudlGetSongs.current = true;
      shoudlGetPlaylists.current = true;
      shoudlGetSingers.current = true;
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
