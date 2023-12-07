import { MouseEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong, useActuallySongs, useAuthStore } from "../store";

import { handleTimeText } from "../utils/appHelpers";

import { Song, User } from "../types";
import { useLocation } from "react-router-dom";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { mySetDoc } from "../utils/firebaseHelpers";

import { useLocalStorage } from "../hooks";

interface Props {
   admin?: boolean;
   audioEle: HTMLAudioElement;
   isOpenFullScreen: boolean;
   durationLineRef: RefObject<HTMLDivElement>;
   timeProcessLine: RefObject<HTMLDivElement>;
   currentTimeRef: RefObject<HTMLDivElement>;
   remainingTimeRef: RefObject<HTMLDivElement>;
}

export default function useControl({
   audioEle,
   admin,
   isOpenFullScreen,
   durationLineRef,
   timeProcessLine,
   currentTimeRef,
   remainingTimeRef,
}: Props) {
   // use store
   const dispatch = useDispatch();
   const { userInfo } = useAuthStore();
   const { actuallySongs } = useActuallySongs();
   const {
      playStatus: { isPlaying, isRepeat, isShuffle },
   } = useSelector(selectAllPlayStatusStore);
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);

   // state
   const [isLoaded, setIsLoaded] = useState(false);
   const [someThingToTriggerError, setSomeThingToTriggerError] = useState(0);
   const [someThingToUpdateHistory, setSomeThingToUpdateHisory] = useState(0);
   const [noLongerPlay, setNoLongerPlay] = useState(true);

   // ref
   const currentIndex = useRef(0);
   const durationRef = useRef(0);
   const durationLineRefWidth = useRef<number>();
   const prevSeekTime = useRef(0);

   const isEndOfList = useRef(false);

   const firstTimePlay = useRef(true);
   const intervalId = useRef<NodeJS.Timeout>();
   // const history = useRef<string[]>([]);

   // use hook
   const [_playHistory, setPlayHistory] = useLocalStorage<string[]>("play_history", []);
   const location = useLocation();
   const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

   // use local storage instead of dispatch user info
   const updateHistory = async () => {
      if (admin) return;
      if (!songInStore.id) return;

      const playHistory = JSON.parse(localStorage.getItem("play_history") || "[]");

      let newHistory: string[] = [];
      if (playHistory.length) {
         newHistory = [...playHistory];

         const index = newHistory.find((id) => id === songInStore.id);
         if (index) return;
      }

      newHistory.push(songInStore.id);
      if (newHistory.length > 5) newHistory = newHistory.slice(1);

      setPlayHistory(newHistory);

      await mySetDoc({
         collection: "users",
         data: { play_history: newHistory } as Partial<User>,
         id: userInfo.email,
         msg: ">>> api: set play history",
      });
   };

   const play = () => {
      audioEle?.play();

      console.log("play");

      if (!userInfo.email) return;

      if (firstTimePlay.current) {
         firstTimePlay.current = false;
         setSomeThingToUpdateHisory(Math.floor(Math.random() * 10));
      }
   };

   const pause = () => {
      audioEle?.pause();
   };

   const getNewSong = (index: number) => {
      return actuallySongs[index];
   };

   const handlePause = () => {
      dispatch(setPlayStatus({ isPlaying: false }));

      if (intervalId.current) clearInterval(intervalId.current);
   };

   const handlePlaying = () => {
      setNoLongerPlay(false);
      dispatch(setPlayStatus({ isPlaying: true, isWaiting: false, isError: false }));
   };

   const handleWaiting = () => {
      dispatch(setPlayStatus({ isWaiting: true }));
   };

   const handleResetForNewSong = () => {
      const timeProcessLineElement = timeProcessLine.current as HTMLElement;
      setIsLoaded(false);

      if (timeProcessLineElement && currentTimeRef.current && remainingTimeRef.current) {
         currentTimeRef.current.innerText = "00:00";
         remainingTimeRef.current.innerText = "00:00";
         timeProcessLineElement.style.width = "0%";
      }
   };

   const handleSeek = useCallback(
      (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
         const node = e.target as HTMLElement;
         if (durationLineRefWidth.current && durationRef.current) {
            const clientRect = node.getBoundingClientRect();
            const timeProcessLineElement = timeProcessLine.current as HTMLElement;

            const length = e.clientX - clientRect.left;
            const lengthRatio = length / durationLineRefWidth.current;
            const newSeekTime = Math.ceil(lengthRatio * durationRef.current);

            if (audioEle && timeProcessLineElement) {
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
               timeProcessLineElement.style.width = (lengthRatio * 100).toFixed(1) + "%";

               if (!isPlaying) play();
               else dispatch(setPlayStatus({ isWaiting: true }));
            }
         }
      },
      [isOpenFullScreen, songInStore]
   );

   const handleNext = useCallback(() => {
      let newIndex = currentIndex.current + 1;
      let newSong: Song;

      if (newIndex < actuallySongs.length) {
         newSong = actuallySongs[newIndex];
      } else {
         newSong = actuallySongs[0];
         newIndex = 0;
      }

      dispatch(
         setSong({
            ...newSong,
            currentIndex: newIndex,
            song_in: songInStore.song_in,
         })
      );
   }, [songInStore, actuallySongs]);

   const handlePrevious = useCallback(() => {
      let newIndex = currentIndex.current! - 1;
      let newSong: Song;

      if (newIndex >= 0) {
         newSong = actuallySongs[newIndex];
      } else {
         newSong = actuallySongs[actuallySongs.length - 1];
         newIndex = actuallySongs.length - 1;
      }

      dispatch(
         setSong({
            ...newSong,
            currentIndex: newIndex,
            song_in: songInStore.song_in,
         })
      );
   }, [songInStore, actuallySongs]);

   const handleTimeUpdate = useCallback(() => {
      if (!audioEle) return;

      const currentTime = audioEle?.currentTime;
      const timeProcessLineEle = timeProcessLine.current as HTMLElement;

      if (durationRef.current && currentTime) {
         const newWidth = currentTime / (durationRef.current / 100);

         timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
      }

      if (currentTimeRef.current) {
         currentTimeRef.current.innerText = handleTimeText(currentTime!) || "00:00";
      }
   }, [songInStore, isOpenFullScreen]);

   const handleEnded = () => {
      if (isRepeat === "one") {
         console.log("song repeat one");

         return play();
      }

      if (isShuffle) {
         console.log("song shuffle");

         let randomIndex: number = currentIndex.current!;
         while (randomIndex === currentIndex.current) {
            randomIndex = Math.floor(Math.random() * actuallySongs.length);
         }

         const newSong = getNewSong(randomIndex);

         return dispatch(
            setSong({
               ...newSong,
               currentIndex: randomIndex,
               song_in: songInStore.song_in,
            })
         );
      }

      if (currentIndex.current === actuallySongs.length - 1) {
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
      durationRef.current = audioDuration;
      remainingTimeEle.innerText = handleTimeText(audioDuration);

      durationLineRefWidth.current = durationLineRef.current?.offsetWidth;

      // end of list
      if (isEndOfList.current) {
         isEndOfList.current = false;
         dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
         return;
      }

      if (isInEdit || noLongerPlay) {
         dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));

         const duration = JSON.parse(localStorage.getItem("duration") || "0");
         if (noLongerPlay && duration) {
            audioEle.currentTime = duration;
            handleTimeUpdate();
         }

         setNoLongerPlay(false);
         return;
      }

      play();
   };

   const handleError = () => {
      setSomeThingToTriggerError(Math.random());
   };

   const updateProcessLineWidth = () => {
      durationLineRefWidth.current = durationLineRef.current?.offsetWidth;
   };

   // add events listener
   useEffect(() => {
      if (!audioEle) return;

      audioEle.addEventListener("error", handleError);
      audioEle.addEventListener("pause", handlePause);
      audioEle.addEventListener("playing", handlePlaying);
      audioEle.addEventListener("timeupdate", handleTimeUpdate);
      audioEle.addEventListener("waiting", handleWaiting);
      window.addEventListener("resize", updateProcessLineWidth);

      return () => {
         audioEle.removeEventListener("error", handleError);
         audioEle.removeEventListener("pause", handlePause);
         audioEle.removeEventListener("playing", handlePlaying);
         audioEle.removeEventListener("timeupdate", handleTimeUpdate);
         audioEle.removeEventListener("waiting", handleWaiting);
         window.removeEventListener("resize", updateProcessLineWidth);
      };
   }, []);

   // handle when song error
   useEffect(() => {
      if (!someThingToTriggerError) return;
      if (songInStore.name) dispatch(setPlayStatus({ isWaiting: false, isError: true }));
   }, [someThingToTriggerError]);

   // update audio src, currentIndex, reset song
   useEffect(() => {
      if (!audioEle || !songInStore.name) {
         dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
         return;
      }

      pause();
      dispatch(setPlayStatus({ isWaiting: true, isError: false, isPlaying: false }));

      audioEle.src = songInStore.song_url;
      currentIndex.current = songInStore.currentIndex;

      if (songInStore.name) {
         document.title = `${songInStore.name} - ${songInStore.singer}`;
      }

      return () => {
         handleResetForNewSong();
         clearInterval(intervalId.current);
         firstTimePlay.current = true;
         // setNoLongerPlay(false);
      };
   }, [songInStore]);

   // update site title
   useEffect(() => {
      if (!songInStore.name) return;

      let myTitle = `${songInStore.name} - ${songInStore.singer}`;
      if (!isPlaying && playlistInStore.name && songInStore.song_in.includes(playlistInStore.id)) {
         myTitle = `${playlistInStore.name}`;
      }
      document.title = myTitle;
   }, [isPlaying]);

   // add new song end event
   useEffect(() => {
      if (!audioEle) return;
      audioEle?.addEventListener("ended", handleEnded);

      return () => audioEle?.removeEventListener("ended", handleEnded);
   }, [isRepeat, isShuffle, songInStore.song_in, actuallySongs]);

   // update process lines width
   useEffect(() => {
      updateProcessLineWidth();
   }, [isOpenFullScreen]);

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
   }, [isInEdit, songInStore.id, userInfo.like_song_ids]);

   // update play history
   useEffect(() => {
      if (!someThingToTriggerError) return;

      updateHistory();
   }, [someThingToUpdateHistory]);

   // update duration in local storage
   useEffect(() => {
      if (isPlaying) {
         intervalId.current = setInterval(() => {
            console.log("set localstore");
            localStorage.setItem("duration", JSON.stringify(audioEle.currentTime));
         }, 3000);
      }

      return () => clearInterval(intervalId.current);
   }, [isPlaying]);

   // confirm reload
   useEffect(() => {
      if (noLongerPlay) return;

      const handleWindowReload = (e: BeforeUnloadEvent) => {
         e.preventDefault();
         e.returnValue = true;
      };

      window.addEventListener("beforeunload", handleWindowReload);

      return () => {
         window.removeEventListener("beforeunload", handleWindowReload);
      };
   }, [noLongerPlay]);

   return { handleNext, handlePrevious, handleSeek, play, pause, isLoaded };
}
