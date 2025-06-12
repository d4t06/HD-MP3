import { useEffect, useRef } from "react";
import { myGetDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useLyricContext } from "@/stores/LyricContext";

export default function useGetSongLyric({ active }: { active: boolean }) {
  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);
  const { setLoading, setSongLyrics, songLyrics, loading, shouldGetLyric } =
    useLyricContext();

  const timerId = useRef<NodeJS.Timeout>();

  const getLyric = async () => {
    try {
      if (!currentSongData || !currentSongData.song.lyric_id) return setLoading(false);
      setLoading(true);

      const lyricSnap = await myGetDoc({
        collectionName: "Lyrics",
        id: currentSongData.song.lyric_id,
      });

      if (lyricSnap.exists()) {
        const lyricData = lyricSnap.data() as SongLyricSchema;

        if (typeof lyricData.lyrics === "string")
          setSongLyrics(JSON.parse(lyricData.lyrics || "[]"));
        else setSongLyrics(lyricData.lyrics);
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setLoading(false);
    }
  };

  const resetForNewSong = () => {
    console.log("resetForNewSong");

    clearTimeout(timerId.current);
    setLoading(true);
    setSongLyrics([]);
    shouldGetLyric.current = true;
  };

  //  api get lyric
  useEffect(() => {
    if (active) {
      if (shouldGetLyric.current) {
        shouldGetLyric.current = false;
        timerId.current = setTimeout(() => {
          getLyric();
        }, 500);
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
