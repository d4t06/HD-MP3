import { useEffect, useRef, useState } from "react";
import { myGetDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useLyricContext } from "@/stores/LyricContext";
import { usePlayerContext } from "@/stores";

export default function useSongLyric({ active }: { active: boolean }) {
  const { audioRef } = usePlayerContext();
  if (!audioRef.current) throw new Error("useSongLyric !audioRef.current");

  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);
  const { setLoading, setSongLyrics, songLyrics, loading, ranGetLyric } =
    useLyricContext();

  const [isSongLoaded, setIsSongLoaded] = useState(false);

  const timerId = useRef<NodeJS.Timeout>();

  const getLyric = async () => {
    try {
      if (!currentSongData) return setLoading(false);
      setLoading(true);

      const lyricSnap = await myGetDoc({
        collectionName: "lyrics",
        id: currentSongData.song.id,
        msg: ">>> api: get lyric doc",
      });

      if (lyricSnap.exists()) {
        const lyricData = lyricSnap.data() as RawSongLyric;

        if (typeof lyricData.real_time === "string")
          setSongLyrics(JSON.parse(lyricData.real_time || "[]"));
        else setSongLyrics(lyricData.real_time);
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setLoading(false);
    }
  };

  const resetForNewSong = () => {
    clearTimeout(timerId.current);
    setIsSongLoaded(false);
    setLoading(true);
    setSongLyrics([]);
    ranGetLyric.current = false;
  };

  //  add audio event
  useEffect(() => {
    const handleSongLoaded = async () => {
      setIsSongLoaded(true);
    };

    audioRef.current!.addEventListener("loadeddata", handleSongLoaded);

    return () => {
      // audio possible undefine when component unmounted
      audioRef.current?.removeEventListener("loadeddata", handleSongLoaded);
    };
  }, []);

  //  api get lyric
  useEffect(() => {
    if (songLyrics.length) return;
    if (isSongLoaded && active) {
      if (!ranGetLyric.current) {
        ranGetLyric.current = true;
        timerId.current = setTimeout(() => {
          getLyric();
        }, 500);
      }
    }
  }, [isSongLoaded, active]);

  //  reset
  useEffect(() => {
    if (playStatus === "error") {
      setLoading(false);
      return;
    }
    return () => {
      resetForNewSong();
    };
  }, [currentSongData, playStatus === "error"]);

  return { songLyrics, loading, playStatus };
}
