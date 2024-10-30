import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import { setLocalStorage } from "@/utils/appHelpers";
import { MutableRefObject, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  currentIndexRef: MutableRefObject<number>;
};

export default function usePlayerControl({ currentIndexRef }: Props) {
  const dispatch = useDispatch();
  const { queueSongs } = useSelector(selectSongQueue);
  const { currentSong } = useSelector(selectCurrentSong);
  const { isRepeat, isShuffle, playStatus } = useSelector(selectAllPlayStatusStore);

  const handleNext = useCallback(() => {
    if (currentIndexRef.current === null) return;

    let newIndex = currentIndexRef.current + 1;
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
        song_in: newSong.song_in,
      })
    );
  }, [currentSong, queueSongs]);

  const handlePrevious = useCallback(() => {
    if (currentIndexRef.current === null) return;

    let newIndex = currentIndexRef.current! - 1;
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
        song_in: newSong.song_in,
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

  return {
    handleNext,
    handlePrevious,
    handleRepeatSong,
    handleShuffle,
    playStatus,
    currentSong,
    queueSongs,
  };
}
