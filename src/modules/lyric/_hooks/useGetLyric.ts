import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useLyricContext } from "@/stores/LyricContext";
import { useGetSongLyric } from "@/hooks";

export default function useGetLyric({ active }: { active: boolean }) {
  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);
  const { setLoading, setSongLyrics, songLyrics, loading, shouldGetLyric } =
    useLyricContext();

  const timerId = useRef<NodeJS.Timeout>();

  const { getLyric } = useGetSongLyric({ setLoadingFromParent: setLoading });

  const resetForNewSong = () => {
    console.log("resetForNewSong");

    clearTimeout(timerId.current);
    setLoading(true);
    setSongLyrics([]);
    shouldGetLyric.current = true;
  };

  const handleGetLyric = async () => {
    if (currentSongData?.song) {
      const lyric = await getLyric(currentSongData.song);
      if (lyric) setSongLyrics(JSON.parse(lyric?.lyrics));
    }
  };

  //  api get lyric
  useEffect(() => {
    if (active && currentSongData?.song) {
      if (shouldGetLyric.current) {
        shouldGetLyric.current = false;
        timerId.current = setTimeout(handleGetLyric, 500);
      }
    }
  }, [currentSongData?.song.id, active]);

  useEffect(() => {
    return () => {
      resetForNewSong();
    };
  }, [currentSongData?.song.id]);

  //  reset
  useEffect(() => {
    if (playStatus === "error") {
      setLoading(false);
      resetForNewSong();
    }
  }, [playStatus === "error"]);

  return { songLyrics, loading, playStatus };
}
