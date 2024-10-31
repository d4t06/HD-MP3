import { MouseEvent, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthStore, useTheme, useToast } from "../store";

import {
  formatTime,
  getLinearBg,
  getLocalStorage,
  setLocalStorage,
} from "../utils/appHelpers";

import { useLocation } from "react-router-dom";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";
import { setSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import usePlayerControl from "./usePlayerControl";

interface Props {
  audioEle: HTMLAudioElement;
}

export default function useAudioEvent({ audioEle }: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { queueSongs } = useSelector(selectSongQueue);
  const { playStatus, isRepeat, isShuffle, isCrossFade } = useSelector(
    selectAllPlayStatusStore
  );

  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  // state
  const firstTimeSongLoaded = useRef(true);
  const currentIndexRef = useRef(0); // update current index

  const prevSeekTime = useRef(0); // prevent double click
  const startFadeWhenEnd = useRef(0); // for cross fade
  // for update timeline background
  const themeCode = useRef(theme.content_code); 
  const isEndOfList = useRef(false); // handle end song
  const isPlayingNewSong = useRef(true); // for cross fade
  // only need song when song error if end event fire
  const isSongEnd = useRef(false); 
  // for handle song error
  const isShowMessageWhenSongError = useRef(false); 
  // for not playing status when seek but song paused
  const shouldSetPlayingStatus = useRef(false); 

  const timelineEleRef = useRef<HTMLDivElement>(null);
  const currentTimeEleRef = useRef<HTMLDivElement>(null);

  // use hook
  const { currentSong, handleNext, handlePrevious, handleRepeatSong, handleShuffle } =
    usePlayerControl({ currentIndexRef });
  const location = useLocation();
  const { setErrorToast } = useToast();
  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const memoStorage = useMemo(() => getLocalStorage(), []);

  const play = async (updateTime?: boolean) => {
    try {
      if (firstTimeSongLoaded.current) {
        firstTimeSongLoaded.current = false;

        if (updateTime) {
          const storage = getLocalStorage();

          const currentTime = storage["current_time"] || 0;
          audioEle.currentTime = currentTime;
        }
      }

      await audioEle.play();
      isShowMessageWhenSongError.current = false;
      isSongEnd.current = false;

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

  const handlePlayPause = () => {
    if (playStatus === "playing") pause();
    if (playStatus === "paused") play(true);
  };

  const handlePause = () => {
    dispatch(setPlayStatus({ playStatus: "paused" }));
  };

  const handlePlaying = () => {
    if (playStatus !== "playing") {
      dispatch(setPlayStatus({ playStatus: "playing" }));
    }
  };

  const handleResetForNewSong = () => {
    if (timelineEleRef.current && currentTimeEleRef.current) {
      currentTimeEleRef.current.innerText = "0:00";
      timelineEleRef.current.style.background = "rgba(255, 255, 255, 0.3)";
    }
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const node = e.target as HTMLElement;

    if (timelineEleRef.current) {
      if (playStatus === "playing") dispatch(setPlayStatus({ playStatus: "waiting" }));

      const clientRect = node.getBoundingClientRect();

      const length = e.clientX - clientRect.left;
      const lengthRatio = length / timelineEleRef.current.offsetWidth;
      const newSeekTime = Math.round(lengthRatio * audioEle.duration);

      const currentTime = audioEle.currentTime;

      if (prevSeekTime.current) {
        if (
          Math.abs(currentTime - prevSeekTime.current) < 1 &&
          Math.abs(newSeekTime - prevSeekTime.current) < 1
        ) {
          return;
        }
      }

      updateTimeProgressEle(newSeekTime);

      if (firstTimeSongLoaded.current) {
        setLocalStorage("current_time", newSeekTime);
      } else audioEle.currentTime = newSeekTime;
      prevSeekTime.current = newSeekTime;
    }
  };

  const handleFade = (currentTime: number) => {
    const volInStore = getLocalStorage()["volume"] || 1;
    if (currentTime <= 2) {
      const volumeValue = (currentTime / 2) * volInStore;

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

  const updateTimeProgressEle = (time?: number) => {
    const timeLine = timelineEleRef.current;
    const currentTimeEle = currentTimeEleRef.current;

    const currentTime = time || audioEle.currentTime;

    if (audioEle.duration && timeLine) {
      const ratio = currentTime / (audioEle.duration / 100);
      timeLine.style.background = getLinearBg(themeCode.current, +ratio.toFixed(1));
    }

    if (currentTimeEle) currentTimeEle.innerText = formatTime(currentTime) || "0:00";
  };

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;

    if (shouldSetPlayingStatus.current) dispatch(setPlayStatus({ playStatus: "playing" }));
    updateTimeProgressEle(currentTime);

    if (isCrossFade) handleFade(currentTime);
    if (!!currentTime && Math.round(currentTime) % 3 === 0)
      setLocalStorage("current_time", Math.round(currentTime));
  };

  const handleEnded = () => {
    if (!currentSong) return;
    const storage = getLocalStorage();
    const volInStore = storage["volume"] || 1;
    const timer = storage["timer"];

    if (isRepeat === "one" && !!timer && timer !== 1) {
      return play();
    }

    audioEle.volume = volInStore;
    isSongEnd.current = true;

    if (isShuffle) {
      let randomIndex: number = currentIndexRef.current!;
      while (randomIndex === currentIndexRef.current) {
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

    if (timer === 1) isEndOfList.current = true;
    else if (currentIndexRef.current === queueSongs.length - 1) {
      if (isRepeat === "all") isEndOfList.current = false;
      else isEndOfList.current = true;
    }

    return handleNext();
  };

  const handleLoadStart = () => {
    if (currentIndexRef.current) dispatch(setPlayStatus({ playStatus: "loading" }));
  };

  const handleLoaded = () => {
    const audioDuration = audioEle.duration;

    // setIsLoaded(true);
    const currentSongLocal = memoStorage["current_song"];

    // update control props
    startFadeWhenEnd.current = audioDuration - 3;

    if (currentSong) setLocalStorage("current_song", currentSong);

    // // force paused by timer
    // if (playStatus === "force-paused")
    //   return dispatch(setPlayStatus({ playStatus: "paused" }));

    // case end of list
    if (isEndOfList.current) {
      isEndOfList.current = false;
      dispatch(setPlayStatus({ playStatus: "paused" }));
      return;
    }

    if (isInEdit || firstTimeSongLoaded.current) {
      dispatch(setPlayStatus({ playStatus: "paused" }));

      if (firstTimeSongLoaded.current) {
        /** update 23/10/2024
         *  update it when click play button
         */
        // firstTimeSongLoaded.current = false;

        const isPlaySongBefore =
          currentSongLocal && currentSongLocal.id === currentSong?.id;
        if (isPlaySongBefore) {
          /** update 23/10/2024
           * do not update song' current time here
           * cause' it cause error on iphone
           * update it when user click play song
           */
          updateTimeProgressEle(memoStorage["current_time"] || 0);
          return;
        }
      }
    }

    // normal active song case
    play();
  };

  const handleError = () => {
    if (currentIndexRef.current === null) return;
    if (!isShowMessageWhenSongError.current) {
      isShowMessageWhenSongError.current = true;
      setErrorToast("Found internet error");
    }

    // if song end event don't fire
    if (!isSongEnd.current) return dispatch(setPlayStatus({ playStatus: "error" }));

    if (queueSongs.length > 1) {
      // case end of list
      if (currentIndexRef.current === queueSongs.length - 1) {
        dispatch(setPlayStatus({ playStatus: "error" }));
        return;
      }

      handleNext();
    } else dispatch(setPlayStatus({ playStatus: "error" }));
  };

  //   load current song in local storage
  useEffect(() => {
    const currentSong = memoStorage["current_song"] || null;
    if (currentSong) dispatch(setSong(currentSong));
    else firstTimeSongLoaded.current = false;
  }, []);

  // add events listener
  useEffect(() => {
    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("play", handlePlaying);
    audioEle.addEventListener("loadstart", handleLoadStart);
    /** should not add 'waiting event'
     * is cause error on iphone
     */
    // audioEle.addEventListener("waiting", handleWaiting);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePause);
      audioEle.removeEventListener("play", handlePlaying);
      audioEle.removeEventListener("loadstart", handleLoadStart);
    };
  }, []);

  // update audio src, currentIndexRef, reset song
  useEffect(() => {
    if (!currentSong) {
      dispatch(setPlayStatus({ playStatus: "paused" }));
      return;
    }

    audioEle.src = currentSong.song_url;

    currentIndexRef.current = currentSong.currentIndex;
    document.title = `${currentSong.name} - ${currentSong.singer}`;

    return () => {
      handleResetForNewSong();
      isPlayingNewSong.current = true;
    };
  }, [currentSong]);

  // update site title, and decide to set waiting status
  useEffect(() => {
    if (!currentSong) return;

    if (playStatus === "paused") shouldSetPlayingStatus.current = false;
    else if (playStatus === "playing") shouldSetPlayingStatus.current = true;

    let myTitle = `${currentSong.name} - ${currentSong.singer}`;
    if (
      playStatus === "paused" &&
      currentPlaylist &&
      currentSong.song_in.includes(currentPlaylist.id)
    ) {
      myTitle = `${currentPlaylist.name}`;
    }
    document.title = myTitle;
  }, [playStatus]);

  //   update song end event
  useEffect(() => {
    audioEle.addEventListener("ended", handleEnded);

    return () => audioEle.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, currentSong, queueSongs]);

  //   update time update event
  useEffect(() => {
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isCrossFade]);

  // update time line background color
  useEffect(() => {
    themeCode.current = theme.content_code;
    // if user no click play yet
    updateTimeProgressEle(firstTimeSongLoaded.current ? memoStorage["current_time"] : 0);
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

  return {
    timelineEleRef,
    currentTimeEleRef,
    handleSeek,
    playStatus,
    currentSong,
    play,
    pause,
    handlePlayPause,
    isRepeat,
    isShuffle,
    isCrossFade,
    handlePrevious,
    handleRepeatSong,
    handleShuffle,
    queueSongs,
    handleNext,
  };
}
