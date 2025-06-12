import { useEffect, useRef } from "react";
import { usePlayerContext } from "../_components/PlayerContext";
import { useGetSongLyric } from "@/hooks";
import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";

export default function useGetLyric() {
  const { canPlay, setLyrics, shouldGetLyric } = usePlayerContext();
  const { currentSong } = useSongsContext();

  const timerId = useRef<NodeJS.Timeout>();

  const { _loading, getLyric } = useGetSongLyric({});

  const handleGetLyric = async () => {

    if (currentSong) {
      const lyric = await getLyric(currentSong);
      if (lyric) setLyrics(JSON.parse(lyric?.lyrics));
    }
  };

  //  api get lyric
  useEffect(() => {
    if (canPlay) {
      if (shouldGetLyric.current) {
        shouldGetLyric.current = false;
        timerId.current = setTimeout(handleGetLyric, 500);
      }
    }
  }, [canPlay]);

  return { isFetching: _loading };
}
