import { implementSongQuery } from "@/services/appService";
import {
  genresCollectionRef,
  myGetDoc,
  songsCollectionRef,
} from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { convertToEn, sleep } from "@/utils/appHelpers";
import { documentId, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";

type SongData = {
  shouldFetching: boolean;
  songs: Song[];
};

type TrendingSong = {
  song_id: string;
  week_play: number;
  trending_score: number;
};
type SongMap = Record<string, SongData>;

type TrendingMap = Record<string, TrendingSong[]>;

export default function useSongTable() {
  const { setErrorToast } = useToastContext();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [songMap, setSongMap] = useState<SongMap>();
  const [trendingMap, setTrendingMap] = useState<TrendingMap>();

  const [tab, setTab] = useState("");
  const [week, setWeek] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const lastWeekRef = useRef("");

  const tabs = useMemo(() => {
    if (!genres.length) return [];

    return genres.map((g) => g.name);
  }, [genres]);

  const getCurrentGenre = (label: string) =>
    genres.find((g) => convertToEn(label) === convertToEn(g.name))?.id || "";

  const KEY = useMemo(() => getCurrentGenre(tab), [genres, tab]);

  const initSongMap = () => {
    return tabs.reduce((r, name) => {
      const data: SongData = { songs: [], shouldFetching: true };
      return {
        ...r,
        [getCurrentGenre(name)]: data,
      };
    }, {} as SongMap);
  };

  const ranEffect = useRef(false);

  const getGenres = async () => {
    try {
      const getGenresQ = query(
        genresCollectionRef,
        where("is_main", "==", true),
      );

      if (import.meta.env.DEV) console.log("Get genres");
      const genresSnap = await getDocs(getGenresQ);
      if (genresSnap.empty) return;

      const newGenres = genresSnap.docs.map(
        (d) => ({ ...d.data(), id: d.id }) as Genre,
      );

      setGenres(newGenres);
      setTab(newGenres[0].name);
    } catch (error) {
      console.log("Error when get genres");
    }
  };

  const getSong = async () => {
    try {
      if (!week || !tab || !KEY) return;

      setIsFetching(true);

      const newSongMap = songMap ? { ...songMap } : initSongMap();
      const newSongData = { ...newSongMap[KEY] };

      let newTrendingMap = trendingMap ? { ...trendingMap } : undefined;
      // get new trending data
      if (lastWeekRef.current !== week) {
        lastWeekRef.current = week;

        type TrendingData = { trending_songs: TrendingMap };

        const newTrendingSnap = await myGetDoc({
          collectionName: "Trending_Metrics",
          id: week,
          msg: "Get trending data",
        });

        // if got trending metric
        if (newTrendingSnap.exists()) {
          newTrendingMap = (newTrendingSnap.data() as TrendingData)
            .trending_songs;
          // else
        } else newTrendingMap = undefined;
      }

      if (!newTrendingMap) {
        setTrendingMap(undefined);
        if (newSongMap) setSongMap(undefined);

        return;
      }

      if (newSongData.shouldFetching) {
        newSongData.shouldFetching = false;

        const songs = newTrendingMap[KEY];

        // if no trending songs
        if (!songs || !songs.length) {
          newSongData.songs = [];

          Object.assign(newSongMap, { [KEY]: newSongData });
          setSongMap(newSongMap);

          return;
        }

        const songIds = songs.map((s) => s.song_id);

        const getSongQuery = query(
          songsCollectionRef,
          where(documentId(), "in", songIds),
        );

        const result = await implementSongQuery(getSongQuery);
        newSongData.songs = result;

        Object.assign(newSongMap, { [KEY]: newSongData });

        setSongMap(newSongMap);
        setTrendingMap(newTrendingMap);
        
      } else await sleep(100);
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getGenres();
    }
  }, []);

  useEffect(() => {
    if (!week || !tab) return;

    getSong();
  }, [week, tab]);

  return { isFetching, songMap, tabs, KEY, tab, setTab, setWeek };
}
