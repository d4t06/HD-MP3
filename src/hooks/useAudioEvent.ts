import {
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAuthStore, useTheme, useToast } from "../store";

import { getLocalStorage, formatTime, setLocalStorage } from "../utils/appHelpers";

import { useLocation } from "react-router-dom";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import usePlayerControl from "./usePlayerControl";

interface Props {
  audioEle: HTMLAudioElement;
  timelineRef: RefObject<HTMLDivElement>;
  currentTimeRef: RefObject<HTMLDivElement>;
  remainingTimeRef: RefObject<HTMLDivElement>;
}

export default function useAudioEvent({
  audioEle,
  timelineRef,
  currentTimeRef,
  remainingTimeRef,
}: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { queueSongs } = useSelector(selectSongQueue);
  const {
    playStatus: { isPlaying, isRepeat, isShuffle, isCrossFade },
  } = useSelector(selectAllPlayStatusStore);

  const { currentSong } = useSelector(selectCurrentSong);
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  // state
  // const [isLoaded, setIsLoaded] = useState(false);
  const [someThingToTriggerError, setSomeThingToTriggerError] = useState(0);

  const firstTimeSongLoaded = useRef(true);
  const currentIndex = useRef(0); // update current index

  const prevSeekTime = useRef(0); // prevent double click
  const startFadeWhenEnd = useRef(0); // for cross fade
  const themeCode = useRef(theme.content_code); // for update timeline background
  const isEndOfList = useRef(false); // handle end song
  const isPlayingNewSong = useRef(true); // for cross fade
  const intervalId = useRef<NodeJS.Timeout>(); // for update local storage

  // use hook
  const { handleNext } = usePlayerControl();
  const location = useLocation();
  const { setErrorToast } = useToast();
  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const play = () => {
    try {
      audioEle.play();

      if (!user) return;

      if (isPlayingNewSong.current) {
        if (isCrossFade) audioEle.volume = 0;

        isPlayingNewSong.current = false;
        // setSomeThingToUpdateHistory(Math.floor(Math.random() * 10));
      }
    } catch (error) {}
  };

  const pause = () => {
    audioEle.pause();
  };

  const getNewSong = (index: number) => {
    return queueSongs[index];
  };

  const handlePlayPause = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying]);

  const handlePause = () => {
    dispatch(setPlayStatus({ isPlaying: false }));

    if (intervalId.current) clearInterval(intervalId.current);
  };

  const handlePlaying = () => {
    firstTimeSongLoaded.current = false;
    dispatch(setPlayStatus({ isPlaying: true, isWaiting: false, isError: false }));
  };

  const handleResetForNewSong = () => {
    // setIsLoaded(false);

    if (!firstTimeSongLoaded.current) setLocalStorage("duration", 0);

    if (timelineRef.current && currentTimeRef.current && remainingTimeRef.current) {
      currentTimeRef.current.innerText = "0:00";
      remainingTimeRef.current.innerText = "0:00";
      timelineRef.current.style.background = "#e1e1e1";
    }
  };

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;

      if (timelineRef.current) {
        const clientRect = node.getBoundingClientRect();

        const length = e.clientX - clientRect.left;
        const lengthRatio = length / timelineRef.current.offsetWidth;
        const newSeekTime = Math.ceil(lengthRatio * audioEle.duration);

        const currentTime = audioEle.currentTime;

        if (prevSeekTime.current) {
          if (
            Math.abs(currentTime - prevSeekTime.current) < 1 &&
            Math.abs(newSeekTime - prevSeekTime.current) < 1
          ) {
            console.log("no seek");
            return;
          }
        }

        audioEle.currentTime = newSeekTime;
        prevSeekTime.current = newSeekTime;
      }
    },
    []
  );

  const handleFade = (currentTime: number) => {
    const storage = getLocalStorage();
    const volInStore = storage["volume"] || 1;
    if (currentTime <= 2) {
      const volumeValue = (currentTime / 2) * volInStore;
      // console.log("check val", volumeValue.toFixed(2), volInStore);

      audioEle.volume = volumeValue;
    } else if (currentTime < startFadeWhenEnd.current) {
      const curAudioVolume = audioEle.volume;
      if (curAudioVolume != volInStore) audioEle.volume = volInStore;
      return;
    }

    if (currentTime >= startFadeWhenEnd.current) {
      const volumeValue = ((audioEle.duration - currentTime) / 2) * volInStore;
      // console.log("check val", volumeValue.toFixed(2), volInStore);
      audioEle.volume = volumeValue;
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;
    const timeLine = timelineRef.current as HTMLElement;

    if (audioEle.duration && currentTime && timeLine) {
      const ratio = currentTime / (audioEle.duration / 100);
      timeLine.style.background = `linear-gradient(to right, ${themeCode.current} ${ratio}%, #e1e1e1 ${ratio}%, #e1e1e1 100%)`;
    }

    if (currentTimeRef.current) {
      currentTimeRef.current.innerText = formatTime(currentTime!) || "00:00";
    }

    if (isCrossFade) handleFade(currentTime);
  };

  const handleEnded = () => {
    const storage = getLocalStorage();
    const volInStore = storage["volume"] || 1;

    audioEle.volume = volInStore;

    if (isRepeat === "one") {
      return play();
    }

    if (isShuffle) {
      let randomIndex: number = currentIndex.current!;
      while (randomIndex === currentIndex.current) {
        randomIndex = Math.floor(Math.random() * queueSongs.length);
      }

      const newSong = getNewSong(randomIndex);
      return dispatch(
        setSong({
          ...newSong,
          currentIndex: randomIndex,
          song_in: currentSong.song_in,
        })
      );
    }

    if (currentIndex.current === queueSongs.length - 1) {
      const timer = storage["timer"];

      if (isRepeat === "all" || !!timer) isEndOfList.current = false;
      else isEndOfList.current = true;
    }

    return handleNext();
  };

  const handleLoaded = () => {
    const remainingTimeEle = remainingTimeRef.current as HTMLDivElement;
    const audioDuration = audioEle.duration;

    // setIsLoaded(true);
    const storage = getLocalStorage();
    const currentSongLocal = storage["current"];

    // update text
    remainingTimeEle.innerText = formatTime(audioDuration);

    // update control props
    startFadeWhenEnd.current = audioDuration - 3;

    if (!firstTimeSongLoaded.current || !currentSongLocal)
      setLocalStorage("current", currentSong);

    // case end of list
    if (isEndOfList.current) {
      isEndOfList.current = false;
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    if (isInEdit || firstTimeSongLoaded.current) {
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));

      if (firstTimeSongLoaded.current) {
        firstTimeSongLoaded.current = false;

        // if user have play any song before
        // on the other hand the localStore have current song value
        // then update audio current time
        if (currentSongLocal && currentSongLocal.id === currentSong.id) {
          audioEle.currentTime = storage["duration"] || 0;
          // update time line ui
          handleTimeUpdate();
          return;
        }

        console.log("play");

        // the first time user click any song
        // the current song in localStorage is empty
        // then play the song
        play();
      }
    }

    // normal click play case
    play();
  };

  const handleError = () => {
    setSomeThingToTriggerError(Math.random());
  };

  // add events listener
  useEffect(() => {
    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("playing", handlePlaying);
    // audioEle.addEventListener("waiting", handleWaiting);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePause);
      audioEle.removeEventListener("playing", handlePlaying);
      // audioEle.removeEventListener("waiting", handleWaiting);
    };
  }, []);

  // handle when song error
  useEffect(() => {
    if (!someThingToTriggerError) return;
    if (firstTimeSongLoaded.current) return;
    if (currentSong.name) {
      if (queueSongs.length > 1) {
        handleNext();
        setErrorToast("Có lỗi do đường truyền mạng");
      } else dispatch(setPlayStatus({ isWaiting: false, isError: true }));
    }
  }, [someThingToTriggerError]);

  // update audio src, currentIndex, reset song
  useEffect(() => {
    if (!currentSong.name) {
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    pause();
    dispatch(setPlayStatus({ isWaiting: true, isError: false, isPlaying: false }));

    audioEle.src = currentSong.song_url;
    currentIndex.current = currentSong.currentIndex;

    if (currentSong.name) {
      document.title = `${currentSong.name} - ${currentSong.singer}`;
    }

    return () => {
      handleResetForNewSong();
      clearInterval(intervalId.current);
      isPlayingNewSong.current = true;
    };

    // use combine dependencies in other to prevent reload after edit song
  }, [currentSong.id + currentSong.song_in + currentSong.currentIndex]);

  // update site title
  useEffect(() => {
    if (!currentSong.name) return;

    let myTitle = `${currentSong.name} - ${currentSong.singer}`;
    if (
      !isPlaying &&
      currentPlaylist.name &&
      currentSong.song_in.includes(currentPlaylist.id)
    ) {
      myTitle = `${currentPlaylist.name}`;
    }
    document.title = myTitle;
  }, [isPlaying]);

  // update song end event
  useEffect(() => {
    audioEle.addEventListener("ended", handleEnded);

    return () => audioEle.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, currentSong.song_in, queueSongs]);

  // update time update event
  useEffect(() => {
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => audioEle.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isCrossFade]);

  // update time line background color
  useEffect(() => {
    themeCode.current = theme.content_code;

    if (!isPlaying) {
      handleTimeUpdate();
    }
  }, [theme]);

  // prevent song autoplay after edit finish
  useEffect(() => {
    if (isInEdit) {
      if (isPlaying) pause();
    }

    audioEle.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audioEle.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [isInEdit, currentSong.id, isCrossFade]);

  // update play history
  // useEffect(() => {
  //    if (!someThingToTriggerError) return;

  //    updateHistory();
  // }, [someThingToUpdateHistory]);

  // update duration in local storage
  useEffect(() => {
    if (isPlaying) {
      intervalId.current = setInterval(() => {
        setLocalStorage("duration", audioEle.currentTime.toFixed(1));
      }, 3000);
    }

    return () => clearInterval(intervalId.current);
  }, [isPlaying]);

  return { handleSeek, play, pause, handlePlayPause };
}
