import { useGetSongLyric } from "@/hooks";
import { useLyricContext } from "@/stores";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { sleep } from "@/utils/appHelpers";
import { ReactNode, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

type Props = {
  isOpenLyricTabs: boolean;
  children: ReactNode;
};

export default function GetSongLyric({ isOpenLyricTabs, children }: Props) {
  const { currentSongData } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const { setLoading, shouldGetLyric, setSongLyrics } = useLyricContext();

  const timerId = useRef<NodeJS.Timeout>();

  const { getLyric } = useGetSongLyric({ setLoadingFromParent: setLoading });

  const handleGetLyric = async (song: Song) => {
    if (song.lyric_id) {
      const lyric = await getLyric(song);
      if (lyric) setSongLyrics(JSON.parse(lyric?.lyrics));
    } else {
      await sleep(300);
      setLoading(false);
    }
  };

  const resetForNewSong = () => {
    clearTimeout(timerId.current);
    shouldGetLyric.current = true;

    setLoading(true);
    setSongLyrics([]);
  };

  useEffect(() => {
    if (isOpenLyricTabs && currentSongData?.song) {
      if (shouldGetLyric.current) {
        shouldGetLyric.current = false;

        if (playStatus === "error") {
          setLoading(false);
          return;
        }

        timerId.current = setTimeout(
          () => handleGetLyric(currentSongData.song),
          500,
        );
      }
    }
  }, [isOpenLyricTabs, currentSongData?.song.id, playStatus]);

  useEffect(() => {
    return () => {
      resetForNewSong();
    };
  }, [currentSongData?.song.id]);

  return children;
}
