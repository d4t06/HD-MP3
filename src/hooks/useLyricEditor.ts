import { myGetDoc } from "@/services/firebaseService";
import { useAuthStore } from "@/store";
import { useEditLyricContext } from "@/store/EditSongLyricContext";
import { RefObject, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
  admin?: boolean;
};

export default function useLyricEditor({ audioRef, admin }: Props) {
  const { user } = useAuthStore();

  const {
    baseLyric,
    setSong,
    song,
    setBaseLyricArr,
    setBaseLyric,
    setLyrics,
    setCurrentLyricIndex,
    isChanged,
    isFetching: isSubmitting,
    start,
  } = useEditLyricContext();

  //   const [hasAudioEle, setHasAudioEle] = useState(false);
  const [lyricsRes, setLyricRes] = useState<Lyric>();
  const [isFetching, setIsFetching] = useState(true);

  const ranUseEffect = useRef(false);

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getSong = async () => {
    try {
      const songSnapshot = await myGetDoc({
        collection: "songs",
        id: params?.id as string,
      });

      if (!songSnapshot.exists()) return navigate(admin ? "/dashboard" : "/");

      const songData = songSnapshot.data() as Song;

      if (songData.lyric_id) {
        const lyricSnapshot = await myGetDoc({
          collection: "lyrics",
          id: songData.lyric_id,
        });

        if (lyricSnapshot.exists()) {
          const lyricData = lyricSnapshot.data() as Lyric;
          setLyricRes(lyricData);
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

  //  init state
  useEffect(() => {
    if (lyricsRes) {
      const { base, real_time } = lyricsRes;

      setBaseLyric(base);
      setLyrics(real_time);

      const latestIndex = real_time.length - 1;
      setCurrentLyricIndex(latestIndex + 1);

      if (audioRef.current) {
        const latestEndTime = real_time[latestIndex].end;

        audioRef.current.currentTime = latestEndTime;
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

  useEffect(() => {
    if (!isChanged) return;

    const handleWindowReload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("re", handleWindowReload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowReload);
    };
  }, [isChanged]);

  return { isFetching, song, isChanged, isSubmitting };
}
