import { useEffect, useState } from "react";
import { Lyric, Song } from "../types";
import { myGetDoc } from "../utils/firebaseHelpers";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";

export default function useSongLyric({
  songInStore,
  audioEle,
  isOpenFullScreen,
}: {
  songInStore: Song;
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
}) {
  const [songLyric, setSongLyric] = useState<Lyric>({
    id: "",
    base: "",
    real_time: [],
  });

  const [loading, setLoading] = useState(false);
  const [isSongLoaded, setIsSongLoaded] = useState(false);
  const {
    playStatus: { isError },
  } = useSelector(selectAllPlayStatusStore);

  const handleSongLoaded = async () => {
    console.log("song loaded");
    setIsSongLoaded(true);
  };

  const getLyric = async () => {
    setLoading(true);

    try {
      const lyricSnap = await myGetDoc({
        collection: "lyrics",
        id: songInStore.lyric_id,
        msg: ">>> api: get lyric doc",
      });

      if (lyricSnap.exists()) {
        const lyricData = lyricSnap.data() as Lyric;
        setSongLyric(lyricData);
      }
    } catch (error) {
      console.log("[error] get lyric error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (audioEle) audioEle.addEventListener("loadeddata", handleSongLoaded);

    return () => {
      // console.log(">>> local: lyric clean up");
      if (audioEle)
        audioEle.removeEventListener("loadeddata", handleSongLoaded);
    };
  }, []);

  useEffect(() => {
    if (isError) {
      setLoading(false);
      return;
    }
    return () => {
      setIsSongLoaded(false);
      setLoading(true);
      setSongLyric({ base: "", real_time: [], id: "" });
    };
  }, [songInStore, isError]);

  useEffect(() => {
    if (!songInStore.lyric_id && isSongLoaded) {
      setLoading(false);
      return;
    }
    if (songLyric.real_time.length) return;
    if (isSongLoaded && isOpenFullScreen) {
      getLyric();
    }
  }, [isSongLoaded, isOpenFullScreen]);

  return { songLyric, loading };
}
