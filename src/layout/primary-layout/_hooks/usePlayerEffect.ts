import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAuthContext,
  usePlayerContext,
  useThemeContext,
  useToastContext,
} from "@/stores";

import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";

import { useLocation } from "react-router-dom";
import {
  PlayStatus,
  selectAllPlayStatusStore,
  setPlayStatus,
} from "@/stores/redux/PlayStatusSlice";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { selectSongQueue, setCurrentQueueId } from "@/stores/redux/songQueueSlice";
import { myUpdateDoc } from "@/services/firebaseService";
import usePlayerAction from "./usePlayerAction";

export default function usePlayerEffect() {
  const {
    isOpenFullScreen,
    playerConig: { repeat, isShuffle, isCrossFade, isEnableBeat },
    audioRef,
    firstTimeSongLoaded,
    startFadeWhenEnd,
    isPlayingNewSong,
    timelineEleRef,
    currentTimeEleRef,
    themeCodeRef,
    shouldSyncSongDuration,
  } = usePlayerContext();
  if (!audioRef.current) throw new Error("Use Control audioRef.current is undefined");

  // use stores
  const dispatch = useDispatch();
  const { theme } = useThemeContext();
  const { user, updateUserData } = useAuthContext();
  const { queueSongs, currentSongData, currentQueueId } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  // state
  const currentSongDataRef = useRef<{ song: Song; index: number }>();

  const isEndOfList = useRef(false); // handle end song
  const isEndEventFired = useRef(false); // handle error
  const isShowMessageWhenSongError = useRef(false); // handle error

  // const timelineEleRef = useRef<HTMLDivElement>(null);
  // const currentTimeEleRef = useRef<HTMLDivElement>(null);
  const playStatusRef = useRef<PlayStatus>("paused");
  const recentSongIdsRef = useRef<string[]>([]);

  // use hook
  const location = useLocation();
  const { setErrorToast } = useToastContext();
  const { next, updateProgressElement, play, pause } = usePlayerAction();

  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);
  const MEMO_STORAGE = useMemo(() => getLocalStorage(), []);

  const getNewSong = (index: number) => {
    return queueSongs[index];
  };

  const handlePause = () => {
    dispatch(setPlayStatus({ playStatus: "paused" }));
  };

  const handlePlaying = () => {
    if (playStatus !== "playing") {
      dispatch(setPlayStatus({ playStatus: "playing" }));

      isShowMessageWhenSongError.current = false;
    }
  };

  const resetForNewSong = () => {
    if (timelineEleRef.current && currentTimeEleRef.current) {
      currentTimeEleRef.current.innerText = "0:00";
      timelineEleRef.current.style.background = "rgba(255, 255, 255, 0.15)";
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
    console.log("end");

    if (!currentSongDataRef.current) return;
    const storage = getLocalStorage();
    const volInStore = storage["volume"] || 1;
    const timer = storage["timer"];

    if (repeat === "one" && !!timer && timer !== 1) {
      return play();
    }

    audioRef.current!.volume = volInStore;
    isEndEventFired.current = true;

    if (isShuffle) {
      let randomIndex: number = currentSongDataRef.current.index;
      while (randomIndex === currentSongDataRef.current.index) {
        randomIndex = Math.round(Math.random() * queueSongs.length - 1);
      }

      const newSong = getNewSong(randomIndex);
      return dispatch(setCurrentQueueId(newSong.queue_id));
    }

    if (timer === 0 && storage["is_timer"]) {
      isEndOfList.current = true;
      setLocalStorage("is_timer", false);
    } else if (currentSongDataRef.current.index === queueSongs.length - 1) {
      if (repeat === "all" || timer >= 1) isEndOfList.current = false;
      else isEndOfList.current = true;
    }

    return next();
  };

  const handleLoadStart = () => {
    if (currentSongDataRef.current) dispatch(setPlayStatus({ playStatus: "loading" }));
  };

  const handleLoaded = () => {
    if (!currentSongDataRef.current) return;

    const audioDuration = audioRef.current!.duration;
    // setIsLoaded(true);
    // const prevQueueId = MEMO_STORAGE["current_queue_id"];

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
        firstTimeSongLoaded.current = false;

        shouldSyncSongDuration.current = true;

        // const isPlaySongBefore =
        //   prevQueueId === currentSongDataRef.current?.song.queue_id;
        // if (isPlaySongBefore)

        /** update 23/10/2024
         * do not update song' current time here
         * cause' it cause error on iphone
         * update it when user click play song
         */

        updateProgressElement(MEMO_STORAGE["current_time"] || 0);
        return;
        // }
      }
    }

    // push recent song
    if (currentSongDataRef.current) {
      if (user) {
        const songId = currentSongDataRef.current.song.id;

        const newUserRecentSongIds = [...recentSongIdsRef.current];
        const founded = newUserRecentSongIds.includes(songId);

        if (!founded) {
          console.log("push recent songs");
          const newUserData: Partial<User> = {
            recent_song_ids: [...newUserRecentSongIds, songId],
          };

          updateUserData(newUserData);
          myUpdateDoc({
            collectionName: "Users",
            data: newUserData,
            id: user.email,
          });
        }
      } else {
        const newRecentSongs = (getLocalStorage()["recent-songs"] || []) as Song[];

        const founded = newRecentSongs.find(
          (s) => s.id === currentSongDataRef.current?.song.id,
        );

        if (!founded) newRecentSongs.unshift(currentSongDataRef.current.song);

        setLocalStorage("recent-songs", newRecentSongs);
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
    if (!isEndEventFired.current) return dispatch(setPlayStatus({ playStatus: "error" }));

    if (queueSongs.length > 1) {
      // case end of list
      if (currentSongDataRef.current.index === queueSongs.length - 1) {
        dispatch(setPlayStatus({ playStatus: "error" }));
        return;
      }

      next();
    } else dispatch(setPlayStatus({ playStatus: "error" }));
  };

  useEffect(() => {
    if (user) recentSongIdsRef.current = user.recent_song_ids;
  }, [user]);

  //   load current song in local storage
  useEffect(() => {
    const currentId = (MEMO_STORAGE["current_queue_id"] as string) || null;

    if (currentId && queueSongs.length) dispatch(setCurrentQueueId(currentId));
    else firstTimeSongLoaded.current = false;
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

    audioRef.current!.src =
      isEnableBeat && currentSongData.song.beat_url
        ? currentSongData.song.beat_url
        : currentSongData.song.song_url;
    currentSongDataRef.current = currentSongData;

    return () => {
      resetForNewSong();
      isPlayingNewSong.current = true;

      if (shouldSyncSongDuration.current) shouldSyncSongDuration.current = false;
    };
  }, [currentSongData?.song]);

  // update site title, and decide to set waiting status
  useEffect(() => {
    if (!currentSongData) {
      // this line reset song after clear queue
      if (playStatus === "paused") resetForNewSong();

      return;
    }

    let myTitle = `${currentSongData.song.name}`;
    if (
      playStatus === "paused" &&
      currentPlaylist &&
      currentSongData.song.queue_id.includes(currentPlaylist.id)
    ) {
      myTitle = `${currentPlaylist.name}`;
    }

    document.title = myTitle;
    playStatusRef.current = playStatus;
  }, [playStatus]);

  //   update song end event
  useEffect(() => {
    console.log("add end event");

    audioRef.current!.addEventListener("ended", handleEnded);

    return () => audioRef.current?.removeEventListener("ended", handleEnded);
  }, [repeat, isShuffle, currentQueueId, queueSongs]);

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
    if (isOpenFullScreen) themeCodeRef.current = "#fff";
    else themeCodeRef.current = theme.content_code;
    // if user no click play yet
    updateProgressElement(firstTimeSongLoaded.current ? MEMO_STORAGE["current_time"] : 0);
  }, [theme, isOpenFullScreen]);

  // prevent song autoplay after edit finish
  useEffect(() => {
    if (isInEdit) {
      if (playStatus === "playing") pause();
    }
  }, [isInEdit]);

  // useEffect(() => {
  //   if (!audioRef.current || !currentSongData?.song) return;

  //   const newValue = !isEnableBeat;

  //   const currentTime = audioRef.current.currentTime;

  //   audioRef.current.src = newValue
  //     ? currentSongData.song.beat_url
  //     : currentSongData.song.song_url;

  //   audioRef.current.currentTime = currentTime;
  // }, [isEnableBeat]);
}
