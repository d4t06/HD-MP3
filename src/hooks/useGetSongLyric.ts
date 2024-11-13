import { useEffect, useRef, useState } from "react";
import { myGetDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import { useLyricContext } from "@/store/LyricContext";

export default function useSongLyric({
  audioEle,
  active,
}: {
  audioEle: HTMLAudioElement;
  active: boolean;
}) {
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
        collection: "lyrics",
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

    if (audioEle) audioEle.addEventListener("loadeddata", handleSongLoaded);

    return () => {
      if (audioEle) audioEle.removeEventListener("loadeddata", handleSongLoaded);
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
