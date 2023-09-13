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
import handleTimeText from "../utils/handleTimeText";

import PlayPauseButton from "./ui/PlayPauseButton";
import { useSongs } from "../store/SongsContext";

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
   const SongStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const { song: songInStore } = SongStore;
   const { songs } = useSongs();
   const { theme } = useTheme();

   const [duration, setDuration] = useState<number>();
   const [isRepeat, setIsRepeat] = useLocalStorage<boolean>("repeat", false);
   const [isShuffle, setIsShuffle] = useLocalStorage<boolean>("shuffle", false);

   const durationLineWidth = useRef<number>();
   const durationLine = useRef<HTMLDivElement>(null);
   const timeProcessLine = useRef<HTMLDivElement>(null);

   const currentTimeRef = useRef<HTMLDivElement>(null);
   const remainingTime = useRef<HTMLDivElement>(null);

   const play = () => {
      audioEle?.play();
   };
   const pause = () => {
      audioEle?.pause();
   };

   const getNewSong = (index: number) => {
      return songs[index];
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
      setIsWaiting(false);
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
      console.log("check store index", songInStore.currentIndex);
      let newIndex = songInStore.currentIndex! + 1;

      let newSong;
      if (newIndex < songs.length) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[0];
         newIndex = 0;
      }

      console.log("check new index", newIndex);

      dispatch(setSong({ ...newSong, currentIndex: newIndex }));
   }, [songInStore]);

   const handlePrevious = useCallback(() => {
      console.log("check store index", songInStore.currentIndex);

      let newIndex = songInStore.currentIndex! - 1;
      let newSong;
      if (newIndex >= 0) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[songs.length - 1];
         newIndex = songs.length - 1;
      }

      console.log("check new index", newIndex);

      dispatch(setSong({ ...newSong, currentIndex: newIndex }));
   }, [songInStore]);

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
            randomIndex = Math.floor(Math.random() * songs.length);
         }

         const newSong = getNewSong(randomIndex);
         return dispatch(
            setSong({
               ...newSong,
               currentIndex: randomIndex,
            })
         );
      }

      return handleNext();
   }, [isRepeat, isShuffle, songInStore]);

   const handleLoaded = () => {
      // set duration
      setDuration(audioEle?.duration);

      // set duration base line width
      durationLineWidth.current = durationLine.current?.offsetWidth;

      // just need to run 1 time
      audioEle?.addEventListener("pause", handlePause);
      audioEle?.addEventListener("play", handlePlay);
      audioEle?.addEventListener("timeupdate", handlePlaying);
      audioEle?.addEventListener("waiting", handleWaiting);

      // play song if click it
      play();
   };

   // run when current song change
   useEffect(() => {
      if (!audioEle) return;
      audioEle.onloadedmetadata = () => {
         handleLoaded();
      };

      return () => {
         audioEle?.removeEventListener("timeupdate", handlePlaying);
         audioEle?.removeEventListener("pause", handlePause);
         audioEle?.removeEventListener("waiting", handleWaiting);
         audioEle?.removeEventListener("play", handlePlay);

         handleResetForNewSong();
         setIsWaiting(true);
      };
   }, [songInStore]);

   // add new handle function when state change
   useEffect(() => {
      // need to render after state change
      if (!audioEle) return;
      audioEle?.addEventListener("ended", handleEnded);
      // console.log("add new handle function when state change");

      return () => audioEle?.removeEventListener("ended", handleEnded);
   }, [isRepeat, isShuffle, songInStore]);

   // update process lines width
   useEffect(() => {
      durationLineWidth.current = durationLine.current?.offsetWidth;
   }, [isOpenFullScreen]);

   const style = {
      button: "p-[5px]",
   };

   return (
      <>
         {/* buttons */}
         <div className={`w-full flex justify-center items-center gap-x-[20px] h-[50px]`}>
            <button
               className={`${style.button} ${isRepeat && theme.content_text}`}
               onClick={() => setIsRepeat(!isRepeat)}
            >
               <ArrowPathRoundedSquareIcon className="w-[30px]" />
            </button>
            <button className={style.button} onClick={() => handlePrevious()}>
               <BackwardIcon className="w-[30px]" />
            </button>

            <PlayPauseButton
               isWaiting={isWaiting}
               isPlaying={isPlaying}
               handlePlayPause={handlePlayPause}
            />

            <button className={style.button} onClick={() => handleNext()}>
               <ForwardIcon className="w-[30px]" />
            </button>
            <button
               className={`${style.button} ${isShuffle && theme.content_text}`}
               onClick={() => setIsShuffle(!isShuffle)}
            >
               <ArrowTrendingUpIcon className="w-[30px]" />
            </button>
         </div>

         {/* process */}
         <div className="flex flex-row items-center h-[30px]">
            <div className="w-[45px]">
               {audioEle && (
                  <span
                     ref={currentTimeRef}
                     className="text-gray-500 text-[14px] font-semibold"
                  >
                     00:00
                  </span>
               )}
            </div>
            <div
               ref={durationLine}
               onClick={(e) => handleSeek(e)}
               className={`h-[4px] hover:h-[6px] flex-1 relative cursor-pointer rounded-3xl overflow-hidden ${theme.type === "light" ? "bg-gray-400" : "bg-gray-200"}`}
            >
               <div
                  ref={timeProcessLine}
                  // style={{ backgroundColor: color }}
                  className={"absolute left-0 top-0 h-full " + theme.content_bg}
               ></div>
            </div>
            <div className="w-[55px] pl-[5px]">
               {audioEle && (
                  <span ref={remainingTime} className="text-[14px] font-semibold">
                     "-00:00"
                  </span>
               )}
            </div>
         </div>
      </>
   );
}
