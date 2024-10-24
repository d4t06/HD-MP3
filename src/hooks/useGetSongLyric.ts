import { useEffect, useRef, useState } from "react";
import { myGetDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { selectCurrentSong } from "@/store/currentSongSlice";

export default function useSongLyric({
  audioEle,
  isOpenFullScreen,
}: {
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
}) {
  const { currentSong } = useSelector(selectCurrentSong);
  const {
    playStatus
  } = useSelector(selectAllPlayStatusStore);

  const [songLyrics, setSongLyrics] = useState<RealTimeLyric[]>([]);

  const [loading, setLoading] = useState(false);
  const [isSongLoaded, setIsSongLoaded] = useState(false);
  const timerId = useRef<NodeJS.Timeout>();

  const getLyric = async () => {
    try {
      if (!currentSong) return setLoading(false);
      setLoading(true);

      const lyricSnap = await myGetDoc({
        collection: "lyrics",
        id: currentSong.id,
        msg: ">>> api: get lyric doc",
      });

      if (lyricSnap.exists()) {
        const lyricData = lyricSnap.data() as SongLyric;
        setSongLyrics(lyricData.real_time);
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
  };

  //  add event
  useEffect(() => {
    const handleSongLoaded = async () => {
      console.log("song loaded");
      setIsSongLoaded(true);
    };

    if (audioEle) audioEle.addEventListener("loadeddata", handleSongLoaded);

    return () => {
      if (audioEle) audioEle.removeEventListener("loadeddata", handleSongLoaded);
    };
  }, []);

  //  api get lyric
  useEffect(() => {
    if (!currentSong?.lyric_id && isSongLoaded) {
      setLoading(false);
      return;
    }
    if (songLyrics.length) return;
    if (isSongLoaded && isOpenFullScreen) {
      timerId.current = setTimeout(() => {
        getLyric();
      }, 500);
    }
  }, [isSongLoaded, isOpenFullScreen]);

  //  reset
  useEffect(() => {
    if (playStatus === "error") {
      setLoading(false);
      return;
    }
    return () => {
      resetForNewSong();
    };
  }, [currentSong, playStatus === "error"]);

  return { songLyrics, loading };
}
