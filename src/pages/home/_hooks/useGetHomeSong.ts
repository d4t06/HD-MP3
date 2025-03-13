import { implementSongQuery } from "@/services/appService";
import { songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const tabs = ["Newest", "Popular"] as const;
type TabType = (typeof tabs)[number];

type SongData = {
  shouldFetching: boolean;
  songs: Song[];
};
type PlaylistMap = Record<TabType, SongData>;

const initPlaylistMap = () => {
  return tabs.reduce((r, key) => {
    const data: SongData = { songs: [], shouldFetching: true };
    return {
      ...r,
      [key]: data,
    };
  }, {} as PlaylistMap);
};

export default function useGetHomeSong() {
  const [songMap, setSongMap] = useState<PlaylistMap>(initPlaylistMap);
  const { setErrorToast } = useToastContext();

  const [tab, setTab] = useState<TabType>("Newest");

  const [isFetching, setIsFetching] = useState(true);

  const getPlaylist = async () => {
    try {
      const newPlaylistData = { ...songMap[tab] };

      setIsFetching(true);

      if (newPlaylistData.shouldFetching) {
        newPlaylistData.shouldFetching = false;

        let getSongQuery;

        switch (tab) {
          case "Newest":
            getSongQuery = query(
              songsCollectionRef,
              where("is_official", "==", true),
              orderBy("updated_at", "desc")
            );
            break;

          case "Popular":
            getSongQuery = query(
              songsCollectionRef,
              where("is_official", "==", true),
              orderBy("play_count", "desc")
            );
            break;
        }

        if (getSongQuery) {
          const result = await implementSongQuery(getSongQuery);
          newPlaylistData.songs = result;

          setSongMap((prev) => ({ ...prev, [tab]: newPlaylistData }));
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
    getPlaylist();

    return () => {
      setIsFetching(true);
    };
  }, [tab]);

  return { isFetching, songMap, tabs, tab, setTab };
}
