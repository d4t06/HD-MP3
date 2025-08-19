import { implementSongQuery } from "@/services/appService";
import {
  genresCollectionRef,
  myGetDoc,
  songsCollectionRef,
} from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { convertToEn, sleep } from "@/utils/appHelpers";
import { documentId, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";

type SongData = {
  shouldFetching: boolean;
  songs: Song[];
};

type TrendingSong = {
  song_id: string;
  rank: number;
  last_week_rank: number;
};
type SongMapByGenre = Record<string, SongData>;

type TrendingSongMapByGenre = Record<string, TrendingSong[]>;

type Trending = { trending_songs: TrendingSongMapByGenre };

export default function useSongTable() {
  const { setErrorToast } = useToastContext();
  const { genres, setGenres } = useSongContext();

  const [songMapByGenre, setSongDataMapByGenre] = useState<SongMapByGenre>();
  const [trendingSongMapByGenre, setTrendingSongMapByGenre] =
    useState<TrendingSongMapByGenre>();

  const [tab, setTab] = useState("");
  const [week, setWeek] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const lastWeekRef = useRef("");

  const tabs = useMemo(() => {
    if (!genres.length) return [];

    return genres.map((g) => g.name);
  }, [genres]);

  const getCurrentGenreId = (label: string) =>
    genres.find((g) => convertToEn(label) === convertToEn(g.name))?.id || "";

  const KEY = useMemo(() => getCurrentGenreId(tab), [genres, tab]);

  const initSongMap = () => {
    return tabs.reduce((r, name) => {
      const data: SongData = { songs: [], shouldFetching: true };
      return {
        ...r,
        [getCurrentGenreId(name)]: data,
      };
    }, {} as SongMapByGenre);
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

      let newSongDataMapByGenre = songMapByGenre
        ? { ...songMapByGenre }
        : undefined;

      let newTrendingSongMapByGenre = trendingSongMapByGenre
        ? { ...trendingSongMapByGenre }
        : undefined;

      // get new trending data
      if (lastWeekRef.current !== week) {
        lastWeekRef.current = week;
        newSongDataMapByGenre = initSongMap();

        const newTrendingSnap = await myGetDoc({
          collectionName: "Trending_Songs",
          id: week,
          msg: "Get trending data",
        });

        if (newTrendingSnap.exists()) {
          newTrendingSongMapByGenre = (newTrendingSnap.data() as Trending)
            .trending_songs;
        } else newTrendingSongMapByGenre = undefined;
      }

      if (!newTrendingSongMapByGenre || !newSongDataMapByGenre) return;

      const currentSongData = newSongDataMapByGenre[KEY];

      if (currentSongData.shouldFetching) {
        currentSongData.shouldFetching = false;

        const currentTrendingSongs = newTrendingSongMapByGenre[KEY];

        // if no trending songs
        if (!currentTrendingSongs || !currentTrendingSongs.length) {
          currentSongData.songs = [];

          Object.assign(newSongDataMapByGenre, { [KEY]: currentSongData });
          setSongDataMapByGenre(newSongDataMapByGenre);

          return;
        }

        const songIds = currentTrendingSongs.map((s) => s.song_id);

        const getSongQuery = query(
          songsCollectionRef,
          where(documentId(), "in", songIds),
        );

        const result = await implementSongQuery(getSongQuery);

        const orderedSongs: Song[] = [];

        currentTrendingSongs.forEach((s) => {
          const founded = result.find((song) => song.id === s.song_id);

          if (founded) {
            founded.rank = s.rank;
            founded.last_week_rank = s.last_week_rank;

            orderedSongs.push(founded);
          }
        });

        currentSongData.songs = orderedSongs;

        Object.assign(newSongDataMapByGenre, { [KEY]: currentSongData });

        setSongDataMapByGenre(newSongDataMapByGenre);
        setTrendingSongMapByGenre(newTrendingSongMapByGenre);
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

      if (!genres.length) getGenres();
      else {
        setTab(tabs[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (!week || !tab) return;

    getSong();
  }, [week, tab]);

  useEffect(() => {
    if (!genres.length) return;

    setSongDataMapByGenre(initSongMap());
  }, [week, genres]);

  return { isFetching, songMapByGenre, tabs, KEY, tab, setTab, setWeek };
}
