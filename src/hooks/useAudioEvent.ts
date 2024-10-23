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
    playStatus: { playStatus, isRepeat, isShuffle, isCrossFade },
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

  // use hook
  const { handleNext } = usePlayerControl();
  const location = useLocation();
  const { setErrorToast } = useToast();
  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const play = async () => {
    try {
      firstTimeSongLoaded.current = false;

      await audioEle.play();

      if (!user) return;
      if (isPlayingNewSong.current) {
        if (isCrossFade) audioEle.volume = 0;
        isPlayingNewSong.current = false;
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
    playStatus === "playing" ? pause() : playStatus === "paused" && play();
  }, [playStatus]);

  const handlePause = () => {
    dispatch(setPlayStatus({ playStatus: "paused" }));
  };

  const handlePlaying = () => {
    dispatch(setPlayStatus({ playStatus: "playing" }));
  };

  const handleResetForNewSong = () => {
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

  const updateTimeProgressEle = (time: number) => {
    const timeLine = timelineRef.current;
    const currentTimeEle = currentTimeRef.current;

    if (audioEle.duration && timeLine) {
      const ratio = time / (audioEle.duration / 100);
      timeLine.style.background = `linear-gradient(to right, #fde68a ${ratio}%, rgba(255,255,255, .3) ${ratio}%, rgba(255,255,255, .3) 100%)`;
    }

    if (currentTimeEle) currentTimeEle.innerText = formatTime(time) || "0:00";
  };

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;

    updateTimeProgressEle(currentTime);

    if (isCrossFade) handleFade(currentTime);

    if (Math.round(currentTime) % 3 === 0)
      setLocalStorage("duration", Math.round(currentTime));
  };

  const handleEnded = () => {
    if (!currentSong) return;
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

  const handleLoadStart = () => {
    console.log("load start");

    dispatch(setPlayStatus({ playStatus: "loading" }));
  };

  const handleLoaded = () => {
    console.log("loaded");

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
      dispatch(setPlayStatus({ playStatus: "paused" }));
      return;
    }

    if (isInEdit || firstTimeSongLoaded.current) {
      console.log("go here");

      dispatch(setPlayStatus({ playStatus: "paused" }));

      if (firstTimeSongLoaded.current) {
        /** update 23/10/2024
         *  update it when click play button
         */
        // firstTimeSongLoaded.current = false;

        // if user have play any song before
        // on the other hand the localStore have current song value
        // then update audio current time

        /** update 23/10/2024
         * do not update song' current time here
         * cause' it cause error on iphone
         * update it when user click play song
         */
        if (currentSongLocal && currentSongLocal.id === currentSong?.id) {
          // update time line ui
          updateTimeProgressEle(storage["duration"] || 0);
          return;
        }

        // the first time user click any song
        // the current song in localStorage is empty
        // then play the song
        // play();

        // return;
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
    if (!currentSong) firstTimeSongLoaded.current = false;

    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("playing", handlePlaying);
    audioEle.addEventListener("loadstart", handleLoadStart);
    /** should not add 'waiting event'
     * is cause error on iphone
     */
    // audioEle.addEventListener("waiting", handleWaiting);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePause);
      audioEle.removeEventListener("playing", handlePlaying);
      audioEle.removeEventListener("loadstart", handleLoadStart);
    };
  }, []);

  // handle when song error
  useEffect(() => {
    if (!someThingToTriggerError) return;
    if (firstTimeSongLoaded.current) return;
    if (currentSong?.name) {
      if (queueSongs.length > 1) {
        handleNext();
        setErrorToast("Found internet error");
      } else dispatch(setPlayStatus({ playStatus: "error" }));
    }
  }, [someThingToTriggerError]);

  // update audio src, currentIndex, reset song
  useEffect(() => {
    if (!currentSong) {
      dispatch(setPlayStatus({ playStatus: "paused" }));
      return;
    }

    audioEle.src = currentSong.song_url;
    currentIndex.current = currentSong.currentIndex;
    document.title = `${currentSong.name} - ${currentSong.singer}`;

    return () => {
      handleResetForNewSong();
      isPlayingNewSong.current = true;
    };

    // use combine dependencies in other to prevent reload after edit song
  }, [currentSong]);

  // update site title
  useEffect(() => {
    if (!currentSong) return;

    let myTitle = `${currentSong.name} - ${currentSong.singer}`;
    if (
      playStatus !== "playing" &&
      currentPlaylist.name &&
      currentSong.song_in.includes(currentPlaylist.id)
    ) {
      myTitle = `${currentPlaylist.name}`;
    }
    document.title = myTitle;
  }, [playStatus]);

  // update song end event
  useEffect(() => {
    audioEle.addEventListener("ended", handleEnded);

    return () => audioEle.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, currentSong, queueSongs]);

  // update time update event
  useEffect(() => {
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => audioEle.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isCrossFade]);

  // update time line background color
  useEffect(() => {
    themeCode.current = theme.content_code;

    if (playStatus !== "playing") {
      handleTimeUpdate();
    }
  }, [theme]);

  // prevent song autoplay after edit finish
  useEffect(() => {
    if (isInEdit) {
      if (playStatus === "playing") pause();
    }

    audioEle.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audioEle.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [isInEdit, currentSong, isCrossFade]);

  return { handleSeek, play, pause, handlePlayPause };
}
