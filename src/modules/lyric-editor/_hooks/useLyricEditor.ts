import { myGetDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { RefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditLyricContext } from "../_components/EditLyricContext";

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
};

export default function useLyricEditor({ audioRef }: Props) {
  const { user } = useAuthContext();

  const {
    baseLyric,
    setSong,
    song,
    setBaseLyricArr,
    setBaseLyric,
    setLyrics,
    isChanged,
    lyrics,
    setIsChanged,
    isFetching: isSubmitting,
    start,
  } = useEditLyricContext();

  const [isFetching, setIsFetching] = useState(true);

  const ranUseEffect = useRef(false);

  const params = useParams<{ id: string }>();
  // const navigate = useNavigate();

  const updateIndex = (lyrics: Lyric[]) => {
    if (!lyrics.length) return;

    const latestIndex = lyrics.length - 1;

    if (audioRef.current) {
      const latestEndTime = lyrics[latestIndex].end;

      start.current = latestEndTime;
    }
  };

  const setTempLyric = () => {
    if (!song) return;

    const tempLyric: TempLyric = {
      song_id: song.id,
      base: baseLyric,
      lyrics: JSON.stringify(lyrics),
    };

    setLocalStorage("temp-lyric", tempLyric);
  };

  const getSong = async () => {
    try {
      if (!params.id) throw new Error("");

      const songSnapshot = await myGetDoc({
        collectionName: "Songs",
        id: params.id,
      });

      if (!songSnapshot.exists()) throw new Error("");

      const song: Song = {
        ...(songSnapshot.data() as SongSchema),
        id: songSnapshot.id,
        queue_id: "",
      };

      if (song.lyric_id) {
        const lyricSnapshot = await myGetDoc({
          collectionName: "Lyrics",
          id: song.lyric_id,
        });

        if (lyricSnapshot.exists()) {
          const { base, lyrics } = lyricSnapshot.data() as SongLyricSchema;
          const parseLyrics = JSON.parse(lyrics) as Lyric[];

          setBaseLyric(base);
          setLyrics(parseLyrics);
          updateIndex(parseLyrics);
        }
      }

      setSong(song);
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  // get song
  useEffect(() => {
    if (!ranUseEffect.current) {
      ranUseEffect.current = true;
      getSong();
    }
  }, [user]);

  // load localStorage
  useEffect(() => {
    const loadTempLyric = () => {
      if (!song) return;

      const { base, lyrics, song_id }: TempLyric =
        getLocalStorage()["temp-lyric"] || {};

      if (song_id === song.id) {
        const parsedLyrics = JSON.parse(lyrics) as Lyric[];

        setBaseLyric(base);
        setLyrics(parsedLyrics);
        updateIndex(parsedLyrics);
        setIsChanged(true);
      }
    };

    loadTempLyric();
  }, [song]);

  // update base lyric array
  useEffect(() => {
    if (!baseLyric) return;

    const filteredLyric = baseLyric.split(/\r?\n/);
    setBaseLyricArr(filteredLyric);
  }, [baseLyric]);

  //  user going to reload the page
  useEffect(() => {
    if (!isChanged) return;

    const handleWindowReload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      setTempLyric();
    };

    window.addEventListener("beforeunload", handleWindowReload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowReload);
    };
  }, [isChanged, baseLyric, lyrics]);

  return { isFetching, song, isChanged, isSubmitting };
}
