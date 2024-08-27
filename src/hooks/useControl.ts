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
import { useAuthStore, useTheme } from "../store";

import {
   getLocalStorage,
   handleTimeText,
   setLocalStorage,
} from "../utils/appHelpers";

import { useLocation } from "react-router-dom";
import {
   selectAllPlayStatusStore,
   setPlayStatus,
} from "../store/PlayStatusSlice";
import useWindowResize from "./useWindowResize";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
// import { useLocalStorage } from ".";

interface Props {
   admin?: boolean;
   audioEle: HTMLAudioElement;
   isOpenFullScreen: boolean;
   timelineRef: RefObject<HTMLDivElement>;
   currentTimeRef: RefObject<HTMLDivElement>;
   remainingTimeRef: RefObject<HTMLDivElement>;
}

export default function useControl({
   audioEle,
   isOpenFullScreen,
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
   const [isLoaded, setIsLoaded] = useState(false);
   const [someThingToTriggerError, setSomeThingToTriggerError] = useState(0);

   const noLongerPlayRef = useRef(true);

   // ref
   const currentIndex = useRef(0);
   const durationRef = useRef(0);
   const timelineRefWidth = useRef<number>();
   const prevSeekTime = useRef(0);
   const startFadeWhenEnd = useRef(0);
   const prevVolume = useRef(0);
   const themeCode = useRef(theme.content_code);

   const isEndOfList = useRef(false);

   const isPlayingNewSong = useRef(true); // for cross fade
   const intervalId = useRef<NodeJS.Timeout>();

   // use hook

   const location = useLocation();
   const isInEdit = useMemo(
      () => location.pathname.includes("edit"),
      [location]
   );

   // const [_playHistory, setPlayHistory] = useLocalStorage<string[]>("play_history", []);

   const updateProcessLineWidth = () => {
      timelineRefWidth.current = timelineRef.current?.offsetWidth;
   };
   useWindowResize(updateProcessLineWidth, [isOpenFullScreen]);

   // use local storage instead of dispatch user info
   // const updateHistory = async () => {
   //    if (admin || !user) return;
   //    if (!currentSong.id) return;

   //    const storage = getLocalStorage();
   //    const playHistory = storage["play_history"] || [];

   //    let newHistory: string[] = [];
   //    if (playHistory.length) {
   //       newHistory = [...playHistory];

   //       const index = newHistory.find((id) => id === currentSong.id);
   //       if (index) return;
   //    }

   //    newHistory.push(currentSong.id);
   //    if (newHistory.length > 5) newHistory = newHistory.slice(1);

   //    setLocalStorage("playHistory", newHistory);
   //    // setPlayHistory(newHistory);

   //    await mySetDoc({
   //       collection: "users",
   //       data: { play_history: newHistory } as Partial<User>,
   //       id: user.email,
   //       msg: ">>> api: set play history",
   //    });
   // };

   const play = () => {
      try {
         audioEle?.play();

         if (!user) return;

         if (isPlayingNewSong.current) {
            if (isCrossFade) audioEle.volume = 0;

            isPlayingNewSong.current = false;
            // setSomeThingToUpdateHistory(Math.floor(Math.random() * 10));
         }
      } catch (error) {}
   };

   const pause = () => {
      audioEle?.pause();
   };

   const getNewSong = (index: number) => {
      return queueSongs[index];
   };

   const handlePause = () => {
      dispatch(setPlayStatus({ isPlaying: false }));

      if (intervalId.current) clearInterval(intervalId.current);
   };

   const handlePlaying = () => {
      noLongerPlayRef.current = false;
      dispatch(
         setPlayStatus({ isPlaying: true, isWaiting: false, isError: false })
      );
   };

   const handleResetForNewSong = () => {
      setIsLoaded(false);

      setLocalStorage("duration", 0);

      if (
         timelineRef.current &&
         currentTimeRef.current &&
         remainingTimeRef.current
      ) {
         currentTimeRef.current.innerText = "00:00";
         remainingTimeRef.current.innerText = "00:00";
         timelineRef.current.style.background = "white";
      }
   };

   const handleSeek = useCallback(
      (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
         const node = e.target as HTMLElement;

         if (timelineRefWidth.current && durationRef.current) {
            const clientRect = node.getBoundingClientRect();

            const length = e.clientX - clientRect.left;
            const lengthRatio = length / timelineRefWidth.current;
            const newSeekTime = Math.ceil(lengthRatio * durationRef.current);

            if (audioEle) {
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
         }
      },
      [isOpenFullScreen, currentSong, isPlaying]
   );

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
         const volumeValue =
            ((durationRef.current - currentTime) / 2) * volInStore;
         // console.log("check val", volumeValue.toFixed(2), volInStore);
         audioEle.volume = volumeValue;
      }
   };

   const handleTimeUpdate = () => {
      if (!audioEle) {
         console.log("auto ele is undefined when update time");
         return;
      }

      const currentTime = audioEle?.currentTime;
      const timeLine = timelineRef.current as HTMLElement;

      if (durationRef.current && currentTime && timeLine) {
         const ratio = currentTime / (durationRef.current / 100);
         timeLine.style.background = `linear-gradient(to right, ${themeCode.current} ${ratio}%, white ${ratio}%, white 100%)`;
      }

      if (currentTimeRef.current) {
         currentTimeRef.current.innerText =
            handleTimeText(currentTime!) || "00:00";
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
         if (isRepeat === "all") isEndOfList.current = false;
         else isEndOfList.current = true;
      }

      return handleNext();
   };

   const handleLoaded = () => {
      if (!audioEle) return;
      const remainingTimeEle = remainingTimeRef.current as HTMLDivElement;
      const audioDuration = audioEle.duration;

      setIsLoaded(true);
      // update text
      durationRef.current = audioDuration;
      remainingTimeEle.innerText = handleTimeText(audioDuration);

      // update control props
      timelineRefWidth.current = timelineRef.current?.offsetWidth;
      startFadeWhenEnd.current = audioDuration - 3;

      if (!noLongerPlayRef.current) setLocalStorage("current", currentSong);

      // case end of list
      if (isEndOfList.current) {
         isEndOfList.current = false;
         dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
         return;
      }

      // case in edit page or (no longer play and have queue localStorage )
      if (isInEdit || noLongerPlayRef.current) {
         dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));

         if (noLongerPlayRef.current) {
            noLongerPlayRef.current = false;

            const storage = getLocalStorage();
            if ((storage["current"] as Song).id === currentSong.id) {
               audioEle.currentTime = storage["duration"] || 0;
            }

            handleTimeUpdate();

            if (!storage["current"]) {
               setLocalStorage("current", currentSong);

               play();
            }
         }

         return;
      }

      // normal click play case
      play();
   };

   const handleError = () => {
      setSomeThingToTriggerError(Math.random());
   };

   // add events listener
   useEffect(() => {
      if (!audioEle) {
         console.log("Audio element is undefined in use control");
         return;
      }

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
      if (currentSong.name)
         dispatch(setPlayStatus({ isWaiting: false, isError: true }));
   }, [someThingToTriggerError]);

   // update audio src, currentIndex, reset song
   useEffect(() => {
      if (!audioEle || !currentSong.name) {
         dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
         return;
      }

      pause();
      dispatch(
         setPlayStatus({ isWaiting: true, isError: false, isPlaying: false })
      );

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
   }, [currentSong.id + currentSong.song_in]);

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
      if (!audioEle) return;
      audioEle?.addEventListener("ended", handleEnded);

      return () => audioEle?.removeEventListener("ended", handleEnded);
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
      if (!audioEle) return;
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
      prevVolume.current = audioEle.volume;
      if (isPlaying) {
         intervalId.current = setInterval(() => {
            setLocalStorage("duration", audioEle.currentTime.toFixed(1));
         }, 3000);
      }

      return () => clearInterval(intervalId.current);
   }, [isPlaying]);

   return { handleNext, handlePrevious, handleSeek, play, pause, isLoaded };
}