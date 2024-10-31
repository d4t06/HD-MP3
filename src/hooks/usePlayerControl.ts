// import { setSong } from "@/store/currentSongSlice";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";
import { selectSongQueue, setCurrentQueueId } from "@/store/songQueueSlice";
import { setLocalStorage } from "@/utils/appHelpers";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function usePlayerControl() {
  const dispatch = useDispatch();
  const { queueSongs, currentQueueId } = useSelector(selectSongQueue);
  // const { currentSong } = useSelector(selectCurrentSong);
  const { isRepeat, isShuffle, playStatus } = useSelector(selectAllPlayStatusStore);

  const handleNext = useCallback(() => {
    // if (currentIndexRef.current === null) return;
    const index = queueSongs.findIndex((s) => s.queue_id === currentQueueId);
    if (index === -1) return;

    let newIndex = index + 1;
    let newSong: Song;

    if (newIndex < queueSongs.length) {
      newSong = queueSongs[newIndex];
    } else {
      newIndex = 0;
      newSong = queueSongs[0];
    }

    dispatch(setCurrentQueueId(newSong.queue_id));
  }, [queueSongs, currentQueueId]);

  const handlePrevious = useCallback(() => {
    const index = queueSongs.findIndex((s) => s.queue_id === currentQueueId);
    if (index === -1) return;
    // if (currentIndexRef.current === null) return;

    let newIndex = index - 1;
    let newSong: Song;
    if (newIndex >= 0) {
      newSong = queueSongs[newIndex];
    } else {
      newSong = queueSongs[queueSongs.length - 1];
      newIndex = queueSongs.length - 1;
    }

    dispatch(setCurrentQueueId(newSong.queue_id));
  }, [currentQueueId, queueSongs]);

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
    queueSongs,
    currentQueueId,
  };
}
