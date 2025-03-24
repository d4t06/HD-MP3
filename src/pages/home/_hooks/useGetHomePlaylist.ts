import { implementPlaylistQuery } from "@/services/appService";
import { playlistCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const tabs = ["Newest", "Popular"] as const;
type TabType = (typeof tabs)[number];

type PlaylistData = {
  shouldFetching: boolean;
  playlists: Playlist[];
};
type PlaylistMap = Record<TabType, PlaylistData>;

const initPlaylistMap = () => {
  return tabs.reduce((r, key) => {
    const data: PlaylistData = { playlists: [], shouldFetching: true };
    return {
      ...r,
      [key]: data,
    };
  }, {} as PlaylistMap);
};

export default function useGetHomePlaylist() {
  const [playlistMap, setPlaylistMap] = useState<PlaylistMap>(initPlaylistMap);
  const { setErrorToast } = useToastContext();

  const [tab, setTab] = useState<TabType>("Newest");

  const [isFetching, setIsFetching] = useState(true);

  const getPlaylist = async () => {
    try {
      const newPlaylistData = { ...playlistMap[tab] };

      setIsFetching(true);

      if (newPlaylistData.shouldFetching) {
        newPlaylistData.shouldFetching = false;

        let getPlaylistQuey;

        switch (tab) {
          case "Newest":
            getPlaylistQuey = query(
              playlistCollectionRef,
              where("is_official", "==", true),
              where("is_public", "==", true),
              orderBy("updated_at", "desc"),
              limit(20),
            );
            break;

          case "Popular":
            getPlaylistQuey = query(
              playlistCollectionRef,
              where("is_official", "==", true),
              where("is_public", "==", true),
              orderBy("like", "desc"),
              limit(20),
            );
            break;
        }

        if (getPlaylistQuey) {
          const result = await implementPlaylistQuery(getPlaylistQuey);
          newPlaylistData.playlists = result;

          setPlaylistMap((prev) => ({ ...prev, [tab]: newPlaylistData }));
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

  return { isFetching, playlistMap, getPlaylist, tabs, tab, setTab };
}
