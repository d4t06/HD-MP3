import { MouseEvent, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthStore, usePlayerContext, useTheme, useToast } from "../store";

import { formatTime, getLocalStorage, setLocalStorage } from "../utils/appHelpers";

import { useLocation } from "react-router-dom";
import {
  PlayStatus,
  selectAllPlayStatusStore,
  setPlayStatus,
} from "@/store/PlayStatusSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { selectSongQueue, setCurrentQueueId } from "@/store/songQueueSlice";
import usePlayerControl from "./usePlayerControl";
import { getLinearBg } from "@/utils/getLinearBg";

export default function useAudioEvent() {
  const { isOpenFullScreen, audioRef } = usePlayerContext();
  if (!audioRef.current) throw new Error("Use Control audioRef.current is undefined");

  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { queueSongs, currentSongData } = useSelector(selectSongQueue);
  const { playStatus, triggerPlayStatus, isRepeat, isShuffle, isCrossFade } = useSelector(
    selectAllPlayStatusStore
  );

  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  // state
  const firstTimeSongLoaded = useRef(true);
  const currentSongDataRef = useRef<{ song: Song; index: number }>();

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

  const timelineEleRef = useRef<HTMLDivElement>(null);
  const currentTimeEleRef = useRef<HTMLDivElement>(null);
  const playStatusRef = useRef<PlayStatus>("paused");

  // use hook
  const location = useLocation();
  const { setErrorToast } = useToast();
  const { currentQueueId, handleNext, handlePrevious, handleRepeatSong, handleShuffle } =
    usePlayerControl();

  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);
  const memoStorage = useMemo(() => getLocalStorage(), []);

  const play = async (updateTime?: boolean) => {
    try {
      if (firstTimeSongLoaded.current) {
        firstTimeSongLoaded.current = false;

        if (updateTime) {
          const storage = getLocalStorage();

          const currentTime = storage["current_time"] || 0;
          audioRef.current!.currentTime = currentTime;
        }
      }

      await audioRef.current!.play();
      isShowMessageWhenSongError.current = false;
      isSongEnd.current = false;

      if (!user) return;
      if (isPlayingNewSong.current) {
        if (isCrossFade) audioRef.current!.volume = 0;
        isPlayingNewSong.current = false;
      }
    } catch (error) {}
  };

  const pause = () => {
    audioRef.current!.pause();
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

  const resetForNewSong = () => {
    if (timelineEleRef.current && currentTimeEleRef.current) {
      currentTimeEleRef.current.innerText = "0:00";
      timelineEleRef.current.style.background = "rgba(255, 255, 255, 0.15)";
    }
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
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

  const handleFade = (currentTime: number) => {
    const volInStore = getLocalStorage()["volume"] || 1;
    if (currentTime <= 2) {
      const volumeValue = (currentTime / 2) * volInStore;

      audioRef.current!.volume = volumeValue;
    } else if (currentTime < startFadeWhenEnd.current) {
      const curAudioVolume = audioRef.current!.volume;
      if (curAudioVolume != volInStore) audioRef.current!.volume = volInStore;
      return;
    }

    if (currentTime >= startFadeWhenEnd.current) {
      const volumeValue = ((audioRef.current!.duration - currentTime) / 2) * volInStore;
      // console.log("check val", volumeValue.toFixed(2), volInStore);
      audioRef.current!.volume = volumeValue;
    }
  };

  const updateProgressElement = (time?: number) => {
    const timeLine = timelineEleRef.current;
    const currentTimeEle = currentTimeEleRef.current;

    const currentTime = time || audioRef.current!.currentTime;

    if (audioRef.current!.duration && timeLine) {
      const ratio = currentTime / (audioRef.current!.duration / 100);
      timeLine.style.background = getLinearBg(themeCode.current, +ratio.toFixed(1));
    }

    if (currentTimeEle) currentTimeEle.innerText = formatTime(currentTime) || "0:00";
  };

  /** still call one when set new song
   * case glitch play playlist button
   * fix: dispatch setSong => playStatus = 'loading'
   * add condition only run timeUpdate when status != "loading"
   */
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current!.currentTime;

    if (playStatusRef.current !== "paused")
      dispatch(setPlayStatus({ playStatus: "playing" }));
    updateProgressElement(currentTime);

    if (isCrossFade) handleFade(currentTime);
    if (!!currentTime && Math.round(currentTime) % 3 === 0)
      setLocalStorage("current_time", Math.round(currentTime));
  };

  const handleEnded = () => {
    if (!currentSongDataRef.current) return;
    const storage = getLocalStorage();
    const volInStore = storage["volume"] || 1;
    const timer = storage["timer"];

    if (isRepeat === "one" && !!timer && timer !== 1) {
      return play();
    }

    audioRef.current!.volume = volInStore;
    isSongEnd.current = true;

    if (isShuffle) {
      let randomIndex: number = currentSongDataRef.current.index;
      while (randomIndex === currentSongDataRef.current.index) {
        randomIndex = Math.round(Math.random() * queueSongs.length - 1);
      }

      const newSong = getNewSong(randomIndex);
      return dispatch(setCurrentQueueId(newSong.queue_id));
    }

    if (timer === 1) isEndOfList.current = true;
    else if (currentSongDataRef.current.index === queueSongs.length - 1) {
      if (isRepeat === "all") isEndOfList.current = false;
      else isEndOfList.current = true;
    }

    return handleNext();
  };

  const handleLoadStart = () => {
    if (currentSongDataRef.current) dispatch(setPlayStatus({ playStatus: "loading" }));
  };

  const handleLoaded = () => {
    if (!currentSongDataRef.current) return;

    const audioDuration = audioRef.current!.duration;
    // setIsLoaded(true);
    const localQueueId = memoStorage["current_queue_id"];

    // update control props
    startFadeWhenEnd.current = audioDuration - 3;
    setLocalStorage("current_queue_id", currentSongDataRef.current.song.queue_id);

    // case end of list
    if (isEndOfList.current) {
      isEndOfList.current = false;

      return dispatch(setPlayStatus({ playStatus: "paused" }));
    }

    if (isInEdit || firstTimeSongLoaded.current) {
      dispatch(setPlayStatus({ playStatus: "paused" }));

      if (firstTimeSongLoaded.current) {
        /** update 23/10/2024
         *  update it when click play button
         */
        // firstTimeSongLoaded.current = false;

        const isPlaySongBefore =
          localQueueId === currentSongDataRef.current?.song.queue_id;
        if (isPlaySongBefore) {
          /** update 23/10/2024
           * do not update song' current time here
           * cause' it cause error on iphone
           * update it when user click play song
           */

          updateProgressElement(memoStorage["current_time"] || 0);
          return;
        }
      }
    }

    // normal active song case
    play();
  };

  const handleWaiting = () => {
    dispatch(setPlayStatus({ playStatus: "waiting" }));
  };

  const handleError = () => {
    if (!currentSongDataRef.current) return;
    if (!isShowMessageWhenSongError.current) {
      isShowMessageWhenSongError.current = true;
      setErrorToast("Found internet error");
    }

    // if song end event don't fire
    if (!isSongEnd.current) return dispatch(setPlayStatus({ playStatus: "error" }));

    if (queueSongs.length > 1) {
      // case end of list
      if (currentSongDataRef.current.index === queueSongs.length - 1) {
        dispatch(setPlayStatus({ playStatus: "error" }));
        return;
      }

      handleNext();
    } else dispatch(setPlayStatus({ playStatus: "error" }));
  };

  //   load current song in local storage
  useEffect(() => {
    const currentId = (memoStorage["current_queue_id"] as string) || null;
    if (currentId && queueSongs.length) {
      dispatch(setCurrentQueueId(currentId));
    } else firstTimeSongLoaded.current = false;
  }, []);

  // add events listener
  useEffect(() => {
    audioRef.current!.addEventListener("error", handleError);
    audioRef.current!.addEventListener("pause", handlePause);
    audioRef.current!.addEventListener("play", handlePlaying);
    audioRef.current!.addEventListener("loadstart", handleLoadStart);
    audioRef.current!.addEventListener("loadedmetadata", handleLoaded);
    audioRef.current!.addEventListener("waiting", handleWaiting);

    return () => {
      audioRef.current?.removeEventListener("error", handleError);
      audioRef.current?.removeEventListener("pause", handlePause);
      audioRef.current?.removeEventListener("play", handlePlaying);
      audioRef.current?.removeEventListener("loadstart", handleLoadStart);
      audioRef.current?.removeEventListener("loadedmetadata", handleLoaded);
      audioRef.current?.addEventListener("waiting", handleWaiting);
    };
  }, []);

  // update audio src, currentIndexRef, reset song
  useEffect(() => {
    // this line handle fist time load song or clear queue
    if (!currentSongData || !currentQueueId) {
      playStatusRef.current = "paused";
      pause();

      return;
    }

    audioRef.current!.src = currentSongData.song.song_url;
    currentSongDataRef.current = currentSongData;

    return () => {
      resetForNewSong();
      isPlayingNewSong.current = true;
    };
  }, [currentSongData?.song]);

  // update site title, and decide to set waiting status
  useEffect(() => {
    if (!currentSongData) {
      // this line reset song after clear queue
      if (playStatus === "paused") resetForNewSong();

      return;
    }

    let myTitle = `${currentSongData.song.name} - ${currentSongData.song.singer}`;
    if (
      playStatus === "paused" &&
      currentPlaylist &&
      currentSongData.song.song_in.includes(currentPlaylist.id)
    ) {
      myTitle = `${currentPlaylist.name}`;
    }

    document.title = myTitle;
    playStatusRef.current = playStatus;
  }, [playStatus]);

  useEffect(() => {
    if (!triggerPlayStatus || triggerPlayStatus === playStatus) return;

    switch (triggerPlayStatus) {
      case "playing":
        play();
        break;
      case "paused":
        pause();
        break;

      default:
        console.log("no trigger action");
    }
  }, [triggerPlayStatus]);

  //   update song end event
  useEffect(() => {
    audioRef.current!.addEventListener("ended", handleEnded);

    return () => audioRef.current?.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, currentQueueId, queueSongs]);

  //   update time update event
  useEffect(() => {
    audioRef.current!.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      // audio possible undefine when component unmounted
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isCrossFade]);

  // update time line background color
  useEffect(() => {
    if (!currentSongDataRef.current) return;

    if (isOpenFullScreen) themeCode.current = "#fff";
    else themeCode.current = theme.content_code;
    // if user no click play yet
    updateProgressElement(firstTimeSongLoaded.current ? memoStorage["current_time"] : 0);
  }, [theme, isOpenFullScreen]);

  // prevent song autoplay after edit finish
  useEffect(() => {
    if (isInEdit) {
      if (playStatus === "playing") pause();
    }
  }, [isInEdit]);

  return {
    isOpenFullScreen,
    timelineEleRef,
    currentTimeEleRef,
    handleSeek,
    playStatus,
    currentSongData,
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
    resetForNewSong,
    handleNext,
  };
}
