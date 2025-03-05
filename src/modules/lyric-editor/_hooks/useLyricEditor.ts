import { myGetDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { useEditLyricContext } from "@/stores/EditLyricContext";
import { getLocalStorage } from "@/utils/appHelpers";
import { RefObject, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
  admin?: boolean;
};

type TempLyric = Omit<SongLyric, "real_time"> & {
  real_time: string;
};

export default function useLyricEditor({ audioRef, admin }: Props) {
  const { user } = useAuthContext();

  const {
    baseLyric,
    setSong,
    song,
    setBaseLyricArr,
    setBaseLyric,
    setLyrics,
    isChanged,
    setIsChanged,
    isFetching: isSubmitting,
    start,
  } = useEditLyricContext();

  const [lyricsRes, setLyricRes] = useState<SongLyric>();
  const [isFetching, setIsFetching] = useState(true);

  const ranUseEffect = useRef(false);

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getSong = async () => {
    try {
      const songSnapshot = await myGetDoc({
        collectionName: "Songs",
        id: params?.id as string,
      });

      if (!songSnapshot.exists()) return navigate(admin ? "/dashboard" : "/");

      const songData = songSnapshot.data() as Song;

      if (songData) {
        const lyricSnapshot = await myGetDoc({
          collectionName: "Lyrics",
          id: songData.id,
        });

        if (lyricSnapshot.exists()) {
          const lyricData = lyricSnapshot.data();

          const lyrics =
            typeof lyricData.real_time === "string"
              ? JSON.parse(lyricData.real_time)
              : lyricData.real_time;

          setLyricRes({
            base: lyricData.base,
            id: lyricData.id,
            real_time: lyrics,
          });
        }
      }

      setSong(songData);
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  // api request
  useEffect(() => {
    if (!user) return;

    if (!ranUseEffect.current) {
      ranUseEffect.current = true;
      getSong();
    }
  }, [user]);

  // load localStorage
  useEffect(() => {
    const songLyricInStorage = (getLocalStorage()["temp-lyric"] as TempLyric) || null;

    if (songLyricInStorage && songLyricInStorage.id === song?.id) {
      try {
        const songLyric = {
          ...songLyricInStorage,
          real_time: JSON.parse(songLyricInStorage.real_time),
        } as SongLyric;

        if (song?.id === songLyric.id) {
          setLyricRes(songLyric);
          setIsChanged(true);
        }

        return;
      } catch (error) {
        console.log({ message: error });
      }
    }
  }, [song]);

  // init state
  useEffect(() => {
    if (lyricsRes) {
      const { base, real_time } = lyricsRes;

      setBaseLyric(base);
      setLyrics(real_time);

      if (!real_time.length) return;

      const latestIndex = real_time.length - 1;

      if (audioRef.current) {
        const latestEndTime = real_time[latestIndex].end;

        //   audioRef.current.currentTime = latestEndTime;
        start.current = latestEndTime;
      }
    }
  }, [lyricsRes]);

  // update base lyric array
  useEffect(() => {
    if (!baseLyric) return;

    const filteredLyric = baseLyric.split(/\r?\n/).filter((l) => l);
    setBaseLyricArr(filteredLyric);
  }, [baseLyric]);

  // ask when user going to reload the page
  useEffect(() => {
    if (!isChanged) return;

    const handleWindowReload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleWindowReload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowReload);
    };
  }, [isChanged]);

  return { isFetching, song, isChanged, isSubmitting };
}
