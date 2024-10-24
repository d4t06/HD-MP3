import {
  MouseEvent,
  // RefObject,
  useCallback,
  useEffect,
  // useMemo,
  useRef,
  // useState,
} from "react";

// import { useSelector } from "react-redux";
import { useTheme } from "../store";

import {  formatTime, setLocalStorage } from "../utils/appHelpers";

// import { useLocation } from "react-router-dom";
// import { setPlayStatus } from "@/store/PlayStatusSlice";
// import { setSong } from "@/store/currentSongSlice";
// import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
// import { selectSongQueue } from "@/store/songQueueSlice";
import usePlayerControl from "./usePlayerControl";

interface Props {
  audioEle: HTMLAudioElement;
  // timelineEleRef: RefObject<HTMLDivElement>;
  // currentTimeEleRef: RefObject<HTMLDivElement>;
}

export default function useAudioEvent({
  audioEle,
}: // timelineEleRef,
// currentTimeEleRef,
Props) {
  // use store
  // const dispatch = useDispatch();
  const { theme } = useTheme();
  // const { user } = useAuthStore();
  // const { queueSongs } = useSelector(selectSongQueue);
  // const { playStatus, isCrossFade } = useSelector(
  //   selectAllPlayStatusStore
  // );

  // const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  // state
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [someThingToTriggerError, _setSomeThingToTriggerError] = useState(0);

  // const firstTimeSongLoaded = useRef(true);
  // const currentIndex = useRef(0); // update current index

  const prevSeekTime = useRef(0); // prevent double click
  // const startFadeWhenEnd = useRef(0); // for cross fade
  const themeCode = useRef(theme.content_code); // for update timeline background
  // const isEndOfList = useRef(false); // handle end song
  // const isPlayingNewSong = useRef(true); // for cross fade

  const timelineEleRef = useRef<HTMLDivElement>(null);
  const currentTimeEleRef = useRef<HTMLDivElement>(null);

  // use hook
  const { currentSong } = usePlayerControl();
  // const location = useLocation();
  // const { setErrorToast } = useToast();
  // const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  // const memoStorage = useMemo(() => getLocalStorage(), []);

  // const play = async () => {
  //   try {
  //     if (firstTimeSongLoaded.current) {
  //       firstTimeSongLoaded.current = false;

  //       const currentTime = memoStorage["current_time"] || 0;
  //       audioEle.currentTime = currentTime;
  //     }

  //     await audioEle.play();

  //     if (!user) return;
  //     if (isPlayingNewSong.current) {
  //       if (isCrossFade) audioEle.volume = 0;
  //       isPlayingNewSong.current = false;
  //     }
  //   } catch (error) {}
  // };

  // const pause = () => {
  //   audioEle.pause();
  // };

  // const getNewSong = (index: number) => {
  //   return queueSongs[index];
  // };

  // const handlePlayPause = () => {
  //   if (playStatus === "playing") pause();
  //   if (playStatus === "paused") play();
  // };

  // const handlePause = () => {
  //   dispatch(setPlayStatus({ playStatus: "paused" }));
  // };

  // const handlePlaying = () => {
  //   dispatch(setPlayStatus({ playStatus: "playing" }));
  // };

  // const handleResetForNewSong = () => {
  //   if (timelineEleRef.current && currentTimeEleRef.current) {
  //     currentTimeEleRef.current.innerText = "0:00";
  //     timelineEleRef.current.style.background = "rgba(255, 255, 255, 0.3)";
  //   }
  // };

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;

      if (timelineEleRef.current) {
        const clientRect = node.getBoundingClientRect();

        const length = e.clientX - clientRect.left;
        const lengthRatio = length / timelineEleRef.current.offsetWidth;
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

        updateTimeProgressEle(newSeekTime);

        // dispatch(setPlayStatus({ playStatus: "loading" }));

        audioEle.currentTime = newSeekTime;
        prevSeekTime.current = newSeekTime;
      }
    },
    []
  );

  // const handleFade = (currentTime: number) => {
  //   const volInStore = getLocalStorage()["volume"] || 1;
  //   if (currentTime <= 2) {
  //     const volumeValue = (currentTime / 2) * volInStore;
  //     // console.log("check val", volumeValue.toFixed(2), volInStore);

  //     audioEle.volume = volumeValue;
  //   } else if (currentTime < startFadeWhenEnd.current) {
  //     const curAudioVolume = audioEle.volume;
  //     if (curAudioVolume != volInStore) audioEle.volume = volInStore;
  //     return;
  //   }

  //   if (currentTime >= startFadeWhenEnd.current) {
  //     const volumeValue = ((audioEle.duration - currentTime) / 2) * volInStore;
  //     // console.log("check val", volumeValue.toFixed(2), volInStore);
  //     audioEle.volume = volumeValue;
  //   }
  // };

  const updateTimeProgressEle = (time?: number) => {
    const timeLine = timelineEleRef.current;
    const currentTimeEle = currentTimeEleRef.current;

    const currentTime = time || audioEle.currentTime;

    if (audioEle.duration && timeLine) {
      const ratio = currentTime / (audioEle.duration / 100);
      timeLine.style.background = `linear-gradient(to right, ${
        themeCode.current
      } ${ratio.toFixed(1)}%, rgba(255,255,255, .3) ${ratio.toFixed(
        1
      )}%, rgba(255,255,255, .3) 100%)`;
    }

    if (currentTimeEle) currentTimeEle.innerText = formatTime(currentTime) || "0:00";
  };

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;

    updateTimeProgressEle(currentTime);

    // if (playStatus !== "playing") dispatch(setPlayStatus({ playStatus: "playing" }));

    // if (isCrossFade) handleFade(currentTime);

    if (!!currentTime && Math.round(currentTime) % 3 === 0)
      setLocalStorage("current_time", Math.round(currentTime));
  };

  // const handleEnded = () => {
  //   if (!currentSong) return;
  //   const storage = getLocalStorage();
  //   const volInStore = storage["volume"] || 1;

  //   audioEle.volume = volInStore;

  //   if (isRepeat === "one") {
  //     return play();
  //   }

  //   if (isShuffle) {
  //     let randomIndex: number = currentIndex.current!;
  //     while (randomIndex === currentIndex.current) {
  //       randomIndex = Math.floor(Math.random() * queueSongs.length);
  //     }

  //     const newSong = getNewSong(randomIndex);
  //     return dispatch(
  //       setSong({
  //         ...newSong,
  //         currentIndex: randomIndex,
  //         song_in: currentSong.song_in,
  //       })
  //     );
  //   }

  //   if (currentIndex.current === queueSongs.length - 1) {
  //     const timer = storage["timer"];

  //     if (isRepeat === "all" || !!timer) isEndOfList.current = false;
  //     else isEndOfList.current = true;
  //   }

  //   return handleNext();
  // };

  // const handleLoadStart = () => {
  //   dispatch(setPlayStatus({ playStatus: "loading" }));
  // };

  // const handleLoaded = () => {
  //   const audioDuration = audioEle.duration;

  //   // setIsLoaded(true);
  //   const currentSongLocal = memoStorage["current_song"];

  //   // update control props
  //   startFadeWhenEnd.current = audioDuration - 3;

  //   if (!firstTimeSongLoaded.current) setLocalStorage("current_song", currentSong);

  //   // case end of list
  //   if (isEndOfList.current) {
  //     isEndOfList.current = false;
  //     dispatch(setPlayStatus({ playStatus: "paused" }));
  //     return;
  //   }

  //   if (isInEdit || firstTimeSongLoaded.current) {
  //     dispatch(setPlayStatus({ playStatus: "paused" }));

  //     if (firstTimeSongLoaded.current) {
  //       /** update 23/10/2024
  //        *  update it when click play button
  //        */
  //       // firstTimeSongLoaded.current = false;

  //       const isPlaySongBefore =
  //         currentSongLocal && currentSongLocal.id === currentSong?.id;
  //       if (isPlaySongBefore) {
  //         /** update 23/10/2024
  //          * do not update song' current time here
  //          * cause' it cause error on iphone
  //          * update it when user click play song
  //          */
  //         updateTimeProgressEle(memoStorage["current_time"] || 0);
  //         return;
  //       }
  //     }
  //   }

  //   // normal click play case
  //   play();
  // };

  // const handleError = () => {
  //   setSomeThingToTriggerError(Math.random());
  // };

  // load current song in local storage
  // useEffect(() => {
  //   const currentSong = memoStorage["current_song"] || null;
  //   if (currentSong) dispatch(setSong(currentSong));
  //   else firstTimeSongLoaded.current = false;
  // }, []);

  // // add events listener
  // useEffect(() => {
  //   audioEle.addEventListener("error", handleError);
  //   audioEle.addEventListener("pause", handlePause);
  //   audioEle.addEventListener("playing", handlePlaying);
  //   audioEle.addEventListener("loadstart", handleLoadStart);
  //   /** should not add 'waiting event'
  //    * is cause error on iphone
  //    */
  //   // audioEle.addEventListener("waiting", handleWaiting);

  //   return () => {
  //     audioEle.removeEventListener("error", handleError);
  //     audioEle.removeEventListener("pause", handlePause);
  //     audioEle.removeEventListener("playing", handlePlaying);
  //     audioEle.removeEventListener("loadstart", handleLoadStart);
  //   };
  // }, []);

  // handle when song error
  // useEffect(() => {
  //   if (!someThingToTriggerError) return;
  //   if (firstTimeSongLoaded.current) return;
  //   if (currentSong?.name) {
  //     if (queueSongs.length > 1) {
  //       handleNext();
  //       setErrorToast("Found internet error");
  //     } else dispatch(setPlayStatus({ playStatus: "error" }));
  //   }
  // }, [someThingToTriggerError]);

  // // update audio src, currentIndex, reset song
  // useEffect(() => {
  //   if (!currentSong) {
  //     dispatch(setPlayStatus({ playStatus: "paused" }));
  //     return;
  //   }

  //   currentIndex.current = currentSong.currentIndex;
  //   document.title = `${currentSong.name} - ${currentSong.singer}`;

  //   return () => {
  //     handleResetForNewSong();
  //     isPlayingNewSong.current = true;
  //   };

  //   // use combine dependencies in other to prevent reload after edit song
  // }, [currentSong]);

  // // update site title
  // useEffect(() => {
  //   if (!currentSong) return;

  //   let myTitle = `${currentSong.name} - ${currentSong.singer}`;
  //   if (
  //     playStatus !== "playing" &&
  //     currentPlaylist.name &&
  //     currentSong.song_in.includes(currentPlaylist.id)
  //   ) {
  //     myTitle = `${currentPlaylist.name}`;
  //   }
  //   document.title = myTitle;
  // }, [playStatus]);

  // update song end event
  // useEffect(() => {
  //   audioEle.addEventListener("ended", handleEnded);

  //   return () => audioEle.removeEventListener("ended", handleEnded);
  // }, [isRepeat, isShuffle, currentSong, queueSongs]);

  // update time update event
  useEffect(() => {
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // // update time line background color
  // useEffect(() => {
  //   themeCode.current = theme.content_code;
  //   // if user no click play yet
  //   updateTimeProgressEle(firstTimeSongLoaded.current ? memoStorage["current_time"] : 0);
  // }, [theme]);

  // // prevent song autoplay after edit finish
  // useEffect(() => {
  //   if (isInEdit) {
  //     if (playStatus === "playing") pause();
  //   }

  //   audioEle.addEventListener("loadedmetadata", handleLoaded);

  //   return () => {
  //     audioEle.removeEventListener("loadedmetadata", handleLoaded);
  //   };
  // }, [isInEdit, currentSong, isCrossFade]);

  return {
    handleSeek,
    // playStatus,
    currentSong,
    timelineEleRef,
    currentTimeEleRef,
    // play,
    // pause,
    // handlePlayPause,
    // playStatus,
    // isRepeat,
    // isShuffle,
    // isCrossFade,
    // handlePrevious,
    // handleRepeatSong,
    // handleShuffle,
    // currentSong,
    // queueSongs,
    // handleNext,
  };
}
