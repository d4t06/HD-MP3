import {
   Dispatch,
   MouseEvent,
   SetStateAction,
   useCallback,
   useEffect,
   useRef,
   useState,
} from "react";
import {
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ForwardIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import useLocalStorage from "../hooks/useLocalStorage";
import { handleTimeText } from "../utils/appHelpers";

import PlayPauseButton from "./ui/PlayPauseButton";
import { useSongsStore } from "../store/SongsContext";
import { Song } from "../types";
import { useActuallySongs } from "../components/Player";
import useGetActuallySongs from "../hooks/useGetActuallySongs";

interface Props {
   audioEle: HTMLAudioElement;
   idle: boolean;
   isOpenFullScreen: boolean;
   isPlaying: boolean;
   isWaiting: boolean;

   setIsWaiting: Dispatch<SetStateAction<boolean>>;
   setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
}

export default function Control({
   audioEle,
   // idle,
   isPlaying,
   isOpenFullScreen,
   isWaiting,

   setIsPlaying,
   setIsWaiting,
}: Props) {
   const { theme } = useTheme();
   const dispatch = useDispatch();
   const SongStore = useSelector(selectAllSongStore);

   const { song: songInStore } = SongStore;

   const [duration, setDuration] = useState<number>();
   const [isRepeat, setIsRepeat] = useLocalStorage<boolean>("repeat", false);
   const [isShuffle, setIsShuffle] = useLocalStorage<boolean>("shuffle", false);

   const durationLineWidth = useRef<number>();
   const durationLine = useRef<HTMLDivElement>(null);
   const timeProcessLine = useRef<HTMLDivElement>(null);

   const currentTimeRef = useRef<HTMLDivElement>(null);
   const remainingTime = useRef<HTMLDivElement>(null);

   const firstTimeRender = useRef(true);
   const isEndOfList = useRef(false);

   // use hooks
   const songLists = useGetActuallySongs({ songInStore });

   const play = () => {
      audioEle?.play();
   };
   const pause = () => {
      audioEle?.pause();
   };

   const getNewSong = (index: number) => {
      return songLists[index];
   };

   // >>> click handle
   const handlePlayPause = () => {
      isPlaying ? pause() : play();
   };

   const handlePause = () => {
      setIsPlaying(false);
   };

   const handlePlay = () => {
      setIsPlaying(true);
      // setIsWaiting(false);
   };

   const handleResetForNewSong = useCallback(() => {
      const timeProcessLineElement = timeProcessLine.current as HTMLElement;

      if (timeProcessLineElement && currentTimeRef.current && remainingTime.current) {
         currentTimeRef.current.innerText = "00:00";
         remainingTime.current.innerText = "-00:00";
         timeProcessLineElement.style.width = "0%";
      }
   }, []);

   const handleSeek = useCallback(
      (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
         const node = e.target as HTMLElement;

         console.log("check durationLineWidth", durationLineWidth.current);

         if (durationLineWidth.current && duration) {
            setIsWaiting(true);

            // get boundingRect
            const clientRect = node.getBoundingClientRect();
            // get elements
            const timeProcessLineElement = timeProcessLine.current as HTMLElement;

            // calculating
            const length = e.clientX - clientRect.left;
            const lengthRatio = length / durationLineWidth.current;
            const newTime = lengthRatio * duration;

            if (audioEle && timeProcessLineElement) {
               // update current time
               audioEle.currentTime = +newTime.toFixed(1);
               // update process line width
               timeProcessLineElement.style.width = (lengthRatio * 100).toFixed(1) + "%";

               if (!isPlaying) play();
            }
         }
      },
      [isOpenFullScreen, songInStore, duration]
   );

   const handleNext = useCallback(() => {
      // console.log("check store index", songInStore.currentIndex);
      // console.log("handleNext check actuallySongs", actuallySongs);

      let newIndex = songInStore.currentIndex + 1;
      // let songLists: Song[];
      let newSong: Song;

      if (newIndex < songLists.length) {
         console.log("next song");

         newSong = songLists[newIndex];
      } else {
         console.log("end of list");

         isEndOfList.current = true;
         newSong = songLists[0];
         newIndex = 0;
      }
      dispatch(
         setSong({ ...newSong, currentIndex: newIndex, song_in: songInStore.song_in })
      );
   }, [songInStore, songLists]);

   const handlePrevious = useCallback(() => {
      // console.log("check store index", songInStore.currentIndex);

      let newIndex = songInStore.currentIndex! - 1;
      let newSong: Song;
      if (newIndex >= 0) {
         newSong = songLists[newIndex];
      } else {
         newSong = songLists[songLists.length - 1];
         newIndex = songLists.length - 1;
      }

      // console.log("check new index", newIndex);

      dispatch(
         setSong({ ...newSong, currentIndex: newIndex, song_in: songInStore.song_in })
      );
   }, [songInStore, songLists]);

   // >>> behind the scenes handle
   const handlePlaying = useCallback(() => {
      setIsWaiting(false);

      const currentTime = audioEle?.currentTime;
      const duration = audioEle?.duration;
      const remaining = duration - currentTime;

      const timeProcessLineEle = timeProcessLine.current as HTMLElement;

      if (duration && currentTime) {
         const newWidth = currentTime / (duration / 100);

         timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
      }

      if (currentTimeRef.current && remainingTime.current) {
         currentTimeRef.current.innerText = handleTimeText(currentTime!);
         remainingTime.current.innerText = "-" + handleTimeText(remaining);
      }
   }, [songInStore, isOpenFullScreen]);

   const handleWaiting = () => {
      setIsWaiting(true);
   };

   const handleEnded = useCallback(() => {
      // console.log("isRepeat, isShuffle =", isRepeat, isShuffle);

      if (isRepeat) {
         console.log("song repeat");

         return play();
      }
      if (isShuffle) {
         console.log("song shuffle");

         let randomIndex: number = songInStore.currentIndex!;
         while (randomIndex === songInStore.currentIndex) {
            randomIndex = Math.floor(Math.random() * songLists.length);
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

      return handleNext();
   }, [isRepeat, isShuffle, songInStore, songLists]);

   const handleLoaded = () => {
      // set duration
      setDuration(audioEle?.duration);

      // set duration base line width
      durationLineWidth.current = durationLine.current?.offsetWidth;

      // just need to run 1 time
      audioEle?.addEventListener("pause", handlePause);
      audioEle?.addEventListener("play", handlePlay);
      audioEle?.addEventListener("timeupdate", handlePlaying);
      // audioEle?.addEventListener("waiting", handleWaiting);

      if (currentTimeRef.current && remainingTime.current) {
         remainingTime.current.innerText = "-" + handleTimeText(audioEle.duration);
      }

      // play song if click it
      if (isEndOfList.current) {
         isEndOfList.current = false;
         setIsWaiting(false);
         setIsPlaying(false);

         return;
      }
      play();
   };

   // add and remove audio element event listener
   useEffect(() => {
      if (!audioEle) return;

      audioEle.src = songInStore.song_url;
      audioEle.onloadedmetadata = () => handleLoaded();

      return () => {
         if (firstTimeRender.current) {
            firstTimeRender.current = false;
            return;
         }
         console.log("run clean up control");

         audioEle.src = "";
         audioEle?.removeEventListener("timeupdate", handlePlaying);
         audioEle?.removeEventListener("pause", handlePause);
         audioEle?.removeEventListener("waiting", handleWaiting);
         audioEle?.removeEventListener("play", handlePlay);

         handleResetForNewSong();
         setIsWaiting(true);
      };
   }, [songInStore]);

   // add new handle when song end function
   useEffect(() => {
      // need to render after state change
      if (!audioEle) return;
      audioEle?.addEventListener("ended", handleEnded);
      // console.log("add new handle function when state change");

      return () => audioEle?.removeEventListener("ended", handleEnded);
   }, [isRepeat, isShuffle, songInStore, songLists]);

   // update process lines width
   useEffect(() => {
      durationLineWidth.current = durationLine.current?.offsetWidth;
   }, [isOpenFullScreen]);

   const classes = {
      button: `p-[5px] ${songLists.length <= 1 && "opacity-20 pointer-events-none"}`,
      buttonsContainer: `w-full flex justify-center items-center gap-x-[20px] h-[50px]`,
      processContainer: `flex flex-row items-center h-[30px]`,
      processLineBase: `h-[4px] hover:h-[6px] flex-1 relative cursor-pointer rounded-3xl overflow-hidden ${
         theme.type === "light" ? "bg-gray-400" : "bg-gray-200"
      }`,
      processLineCurrent: `absolute left-0 top-0 h-full ${theme.content_bg}`,
      currentTime: `text-gray-500 text-[14px] font-semibold`,
      duration: `text-[14px] font-semibold`,
      icon: "w-[30px] ",
   };

   return (
      <>
         {/* buttons */}
         <div className={`${classes.buttonsContainer}`}>
            <button
               className={`${classes.button} ${isRepeat && theme.content_text}`}
               onClick={() => setIsRepeat(!isRepeat)}
            >
               <ArrowPathRoundedSquareIcon className={classes.icon} />
            </button>
            <button className={classes.button} onClick={() => handlePrevious()}>
               <BackwardIcon className={classes.icon} />
            </button>

            <PlayPauseButton
               isWaiting={isWaiting}
               isPlaying={isPlaying}
               handlePlayPause={handlePlayPause}
            />

            <button className={`${classes.button}`} onClick={() => handleNext()}>
               <ForwardIcon className={classes.icon} />
            </button>
            <button
               className={`${classes.button} ${isShuffle && theme.content_text}`}
               onClick={() => setIsShuffle(!isShuffle)}
            >
               <ArrowTrendingUpIcon className={classes.icon} />
            </button>
         </div>

         {/* process */}
         <div className={classes.processContainer}>
            <div className="w-[45px]">
               {audioEle && (
                  <span ref={currentTimeRef} className={`${classes.currentTime}`}>
                     00:00
                  </span>
               )}
            </div>
            <div
               ref={durationLine}
               onClick={(e) => handleSeek(e)}
               className={`${classes.processLineBase}`}
            >
               <div
                  ref={timeProcessLine}
                  className={`${classes.processLineCurrent}`}
               ></div>
            </div>
            <div className="w-[55px] pl-[5px]">
               {audioEle && (
                  <span ref={remainingTime} className={classes.duration}>
                     "-00:00"
                  </span>
               )}
            </div>
         </div>
      </>
   );
}
