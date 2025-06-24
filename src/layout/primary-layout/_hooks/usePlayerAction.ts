import { usePlayerContext } from "@/stores";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import {
  selectSongQueue,
  setCurrentQueueId,
} from "@/stores/redux/songQueueSlice";
import {
  formatTime,
  getLocalStorage,
  setLocalStorage,
} from "@/utils/appHelpers";
import { getLinearBg } from "@/utils/getLinearBg";
import { MouseEventHandler, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function usePlayerAction() {
  const dispatch = useDispatch();

  const {
    playerConig: { isShuffle, repeat, isCrossFade },
    updatePlayerConfig,
    firstTimeSongLoaded,
    audioRef,
    timelineEleRef,
    currentTimeEleRef,
    isPlayingNewSong,
    themeCodeRef,
    shouldSyncSongDuration,
  } = usePlayerContext();
  const { currentSongData, queueSongs } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const prevSeekTime = useRef(0); // prevent double click
  // for update timeline background
  // const isEndOfList = useRef(false); // handle end song
  // const startFadeWhenEnd = useRef(0); // for cross fade
  // const isPlayingNewSong = useRef(true); // for cross fade

  const resetForNewSong = () => {
    if (timelineEleRef.current && currentTimeEleRef.current) {
      currentTimeEleRef.current.innerText = "0:00";
      timelineEleRef.current.style.background = "rgba(255, 255, 255, 0.15)";
    }
  };

  const play = async () => {
    try {
      if (shouldSyncSongDuration.current) {
        shouldSyncSongDuration.current = false;
        const storage = getLocalStorage();

        const currentTime = storage["current_time"] || 0;
        audioRef.current!.currentTime = currentTime;
      }

      await audioRef.current!.play();

      if (isPlayingNewSong.current) {
        if (isCrossFade) audioRef.current!.volume = 0;
        isPlayingNewSong.current = false;
      }
    } catch (error) {}
  };

  const pause = () => {
    audioRef.current!.pause();
  };

  const handlePlayPause = () => {
    if (playStatus === "playing") pause();
    if (playStatus === "paused") play();
  };

  const updateProgressElement = (time?: number) => {
    const timeLine = timelineEleRef.current;
    const currentTimeEle = currentTimeEleRef.current;

    const currentTime = time || audioRef.current!.currentTime;

    if (audioRef.current!.duration && timeLine) {
      const ratio = currentTime / (audioRef.current!.duration / 100);
      timeLine.style.background = getLinearBg(
        themeCodeRef.current,
        +ratio.toFixed(1),
      );
    }

    if (currentTimeEle)
      currentTimeEle.innerText = formatTime(currentTime) || "0:00";
  };

  const handleSeek: MouseEventHandler = (e) => {
    const node = e.target as HTMLElement;

    if (timelineEleRef.current) {
      const clientRect = node.getBoundingClientRect();

      const length = e.clientX - clientRect.left;
      const lengthRatio = length / timelineEleRef.current.offsetWidth;
      const newSeekTime = Math.round(lengthRatio * audioRef.current!.duration);

      const currentTime = audioRef.current!.currentTime;

      if (prevSeekTime.current) {
        if (
          Math.abs(currentTime - prevSeekTime.current) < 1 &&
          Math.abs(newSeekTime - prevSeekTime.current) < 1
        ) {
          return;
        }
      }

      updateProgressElement(newSeekTime);

      if (firstTimeSongLoaded.current) {
        setLocalStorage("current_time", newSeekTime);
      } else audioRef.current!.currentTime = newSeekTime;
      prevSeekTime.current = newSeekTime;
    }
  };

  const toggleShuffle = () => {
    const newValue = !isShuffle;
    updatePlayerConfig({ isShuffle: newValue });

    setLocalStorage("isShuffle", newValue);
  };

  const toggleRepeat = () => {
    let value: typeof repeat;
    switch (repeat) {
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

    setLocalStorage("repeat", value);
    updatePlayerConfig({ repeat: value });
  };

  const next = () => {
    if (!currentSongData) return;

    let newIndex = currentSongData.index + 1;
    let newSong: Song;

    if (newIndex < queueSongs.length) {
      newSong = queueSongs[newIndex];
    } else {
      newIndex = 0;
      newSong = queueSongs[0];
    }

    dispatch(setCurrentQueueId(newSong.queue_id));
  };

  const previous = () => {
    if (!currentSongData) return;
    // if (currentIndexRef.current === null) return;

    let newIndex = currentSongData.index - 1;
    let newSong: Song;
    if (newIndex >= 0) {
      newSong = queueSongs[newIndex];
    } else {
      newSong = queueSongs[queueSongs.length - 1];
      newIndex = queueSongs.length - 1;
    }

    dispatch(setCurrentQueueId(newSong.queue_id));
  };

  return {
    toggleRepeat,
    toggleShuffle,
    next,
    previous,
    repeat,
    isShuffle,
    updateProgressElement,
    handleSeek,
    handlePlayPause,
    play,
    pause,
    resetForNewSong,
  };
}
