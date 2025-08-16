import { implementSongQuery } from "@/services/appService";
import {
  genresCollectionRef,
  songsCollectionRef,
} from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { convertToEn, sleep } from "@/utils/appHelpers";
import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";

type SongData = {
  shouldFetching: boolean;
  songs: Song[];
};

type SongMap = Record<string, SongData>;

export default function useGetNewSong({ amount }: { amount: number }) {
  const { setErrorToast } = useToastContext();
  const { genres, setGenres } = useSongContext();

  const [songMap, setSongMap] = useState<SongMap>();

  const [tab, setTab] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const tabs = useMemo(() => {
    if (!genres.length) return [];

    return genres.map((g) => g.name);
  }, [genres]);

  const getCurrentGenre = (label: string) =>
    genres.find((g) => convertToEn(label) === convertToEn(g.name));

  const currentGenre = useMemo(() => getCurrentGenre(tab), [genres, tab]);

  const currentSongs = useMemo(
    () => (songMap ? songMap[currentGenre?.id || ""].songs : []),
    [songMap, tab],
  );

  const initSongMap = () => {
    return tabs.reduce((r, name) => {
      const data: SongData = { songs: [], shouldFetching: true };
      return {
        ...r,
        [getCurrentGenre(name)?.id || ""]: data,
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

  const getSongs = async () => {
    try {
      if (!tab || !currentGenre) return;

      setIsFetching(true);

      const newSongMap = songMap ? { ...songMap } : initSongMap();
      const newSongData = { ...newSongMap[currentGenre.id] };

      if (newSongData.shouldFetching) {
        newSongData.shouldFetching = false;

        const getSongQuery = query(
          songsCollectionRef,
          where("main_genre.id", "==", currentGenre.id),
          orderBy("updated_at", "desc"),
          limit(amount),
        );

        const result = await implementSongQuery(getSongQuery);
        newSongData.songs = result;

        Object.assign(newSongMap, { [currentGenre.id]: newSongData });

        setSongMap(newSongMap);
      } else await sleep(300);
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
    if (!tab) return;

    getSongs();
  }, [tab]);

  return { isFetching, currentSongs, tabs, tab, setTab };
}
