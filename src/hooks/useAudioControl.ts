import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import { setLocalStorage } from "@/utils/appHelpers";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  audioEle: HTMLAudioElement;
};
export default function useAudioControl({ audioEle }: Props) {
  const dispatch = useDispatch();
  const { queueSongs } = useSelector(selectSongQueue);
  const { currentSong } = useSelector(selectCurrentSong);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  //   ref
  const currentIndex = useRef(0);

  const { isRepeat, isShuffle, isPlaying } = useMemo(() => playStatus, [playStatus]);

  const play = () => {
    try {
      audioEle?.play();
    } catch (error) {}
  };

  const pause = () => {
    audioEle?.pause();
  };

  const handlePlayPause = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    let newIndex = currentIndex.current + 1;
    let newSong: Song;

    if (newIndex < queueSongs.length) {
      newSong = queueSongs[newIndex];
    } else {
      newIndex = 0;
      newSong = queueSongs[0];
    }

    dispatch(
      setSong({
        ...newSong,
        currentIndex: newIndex,
        song_in: currentSong.song_in,
      })
    );
  }, [currentSong, queueSongs]);

  const handlePrevious = useCallback(() => {
    let newIndex = currentIndex.current! - 1;
    let newSong: Song;
    if (newIndex >= 0) {
      newSong = queueSongs[newIndex];
    } else {
      newSong = queueSongs[queueSongs.length - 1];
      newIndex = queueSongs.length - 1;
    }

    dispatch(
      setSong({
        ...newSong,
        currentIndex: newIndex,
        song_in: currentSong.song_in,
      })
    );
  }, [currentSong, queueSongs]);

  const handleShuffle = () => {
    const newValue = !isShuffle;
    dispatch(setPlayStatus({ isShuffle: newValue }));

    setLocalStorage("isShuffle", newValue);
  };

  const handleRepeatSong = () => {
    let value: typeof isRepeat;
    switch (isRepeat) {
      case "no":
        value = "one";
        break;
      case "one":
        value = "all";
        break;
      case "all":
        value = "no";
        break;
      default:
        value = "no";
    }

    setLocalStorage("isRepeat", value);
    dispatch(setPlayStatus({ isRepeat: value }));
  };

  useEffect(() => {
    if (currentSong.name) {
      currentIndex.current = currentSong.currentIndex;
    }
  }, [currentSong]);

  return {
    handleNext,
    handlePrevious,
    play,
    pause,
    handleRepeatSong,
    handleShuffle,
    handlePlayPause,
    playStatus,
    currentSong,
    queueSongs
  };
}
