import { myGetDoc } from "@/services/firebaseService";
// import { useAuthContext } from "@/stores";
// import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { RefObject, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditLyricContext } from "../_components/EditLyricContext";
import { useAuthContext } from "@/stores";

type Props = {
  audioRef: RefObject<HTMLAudioElement>;
};

const isAdmin = location.hash.includes("/dashboard");

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
    isFetching: isSubmitting,
    start,
  } = useEditLyricContext();

  const [isFetching, setIsFetching] = useState(true);

  const ranUseEffect = useRef(false);

  const params = useParams<{ id: string }>();
  const navigator = useNavigate();

  const updateIndex = (lyrics: Lyric[]) => {
    if (!lyrics.length) return;

    const latestIndex = lyrics.length - 1;

    if (audioRef.current) {
      const latestEndTime = lyrics[latestIndex].end;

      start.current = latestEndTime;
      audioRef.current.currentTime = latestEndTime
    }
  };

  const getSong = async () => {
    try {
      if (!params.id || !user) throw new Error("");

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

      // check if user manual type url
      if (isAdmin) {
        if (!song.is_official) {
          navigator("/dashboard/song");
          return;
        }
      } else if (song.is_official || song.owner_email !== user.email) return;

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

      if (!song) getSong();
      else {
        setIsFetching(false);
      }
    }
  }, []);

  // update base lyric array
  useEffect(() => {
    if (!baseLyric) return;

    const filteredLyric = baseLyric.split(/\r?\n/);
    setBaseLyricArr(filteredLyric);
  }, [baseLyric]);

  //  warn user when reload page without save change
  useEffect(() => {
    if (!isChanged) return;
    const handleBeforeRefresh = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeRefresh);
    };
  }, [isChanged]);

  return { isFetching, song, isChanged, isSubmitting };
}
