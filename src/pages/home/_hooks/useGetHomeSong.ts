import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const tabs = ["Newest", "Popular"] as const;
type TabType = (typeof tabs)[number];

type SongData = {
  shouldFetching: boolean;
  songs: Song[];
};
type SongMap = Record<TabType, SongData>;

const initSongMap = () => {
  return tabs.reduce((r, key) => {
    const data: SongData = { songs: [], shouldFetching: true };
    return {
      ...r,
      [key]: data,
    };
  }, {} as SongMap);
};

export default function useGetHomeSong() {
  const [songMap, setSongMap] = useState<SongMap>(initSongMap);
  const { setErrorToast } = useToastContext();

  const [tab, setTab] = useState<TabType>("Newest");

  const [isFetching, setIsFetching] = useState(true);

  const getSong = async () => {
    try {
      const newSongData = { ...songMap[tab] };

      setIsFetching(true);

      if (newSongData.shouldFetching) {
        newSongData.shouldFetching = false;

        let getSongQuery;

        switch (tab) {
          case "Newest":
            getSongQuery = query(
              songsCollectionRef,
              where("is_official", "==", true),
              orderBy("updated_at", "desc"),
              limit(20),
            );
            break;

          case "Popular":
            getSongQuery = query(
              songsCollectionRef,
              where("is_official", "==", true),
              orderBy("like", "desc"),
              limit(20),
            );
            break;
        }

        if (getSongQuery) {
          const result = await implementSongQuery(getSongQuery);
          newSongData.songs = result;

          setSongMap((prev) => ({ ...prev, [tab]: newSongData }));
        }
      } else await sleep(100);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getSong();

    return () => {
      setIsFetching(true);
    };
  }, [tab]);

  return { isFetching, songMap, tabs, tab, setTab };
}
