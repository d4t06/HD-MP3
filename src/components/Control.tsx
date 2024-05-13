import { useCallback, useRef } from "react";
import {
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ForwardIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";

import PlayPauseButton from "./child/PlayPauseButton";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { Countdown } from "./";
import useControl from "../hooks/useControl";
import { setLocalStorage } from "../utils/appHelpers";
import { selectCurrentSong } from "@/store/currentSongSlice";
import { selectSongQueue } from "@/store/songQueueSlice";

interface Props {
   admin?: boolean;
   audioEle: HTMLAudioElement;
   idle: boolean;
   isOpenFullScreen: boolean;
   className?: string;
}

export default function Control({ audioEle, admin, isOpenFullScreen, className }: Props) {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { queueSongs } = useSelector(selectSongQueue);
   const {
      playStatus: { isPlaying, isRepeat, isShuffle, isError },
   } = useSelector(selectAllPlayStatusStore);
   const { currentSong } = useSelector(selectCurrentSong);

   // ref
   const durationLineRef = useRef<HTMLDivElement>(null);
   const timeProcessLine = useRef<HTMLDivElement>(null);

   const currentTimeRef = useRef<HTMLDivElement>(null);
   const remainingTimeRef = useRef<HTMLDivElement>(null);

   const { handleNext, handlePrevious, handleSeek, play, pause, isLoaded } = useControl({
      audioEle,
      isOpenFullScreen,
      admin,
      durationLineRef,
      timeProcessLine,
      currentTimeRef,
      remainingTimeRef,
   });

   // >>> click handle
   const handlePlayPause = useCallback(() => {
      isPlaying ? pause() : play();
   }, [isPlaying]);

   const handleRepeatSong = () => {
      let value: typeof isRepeat;
      switch (isRepeat) {
         case "no":
            value = "one";
            break;
         case "one":
            value = "all";
            break;
         case "all":
            value = "no";
            break;
         default:
            value = "no";
      }

      setLocalStorage("isRepeat", value);
      dispatch(setPlayStatus({ isRepeat: value }));
   };

   const handleShuffle = () => {
      const newValue = !isShuffle;
      dispatch(setPlayStatus({ isShuffle: newValue }));

      setLocalStorage("isShuffle", newValue);
   };

   const classes = {
      button: `p-[5px] ${queueSongs.length <= 1 && "opacity-20 pointer-events-none"}`,
      buttonsContainer: `w-full flex justify-between sm:justify-center items-center gap-x-[20px] ${
         admin ? "" : "h-[50px]"
      }`,
      processContainer: `flex w-full flex-row items-center h-[30px] ${
         admin ? "h-full" : ""
      }`,
      processLineBase: `h-[4px] flex-grow relative cursor-pointer rounded-[99px] bg-gray-200 `,
      processLineCurrent: `absolute left-0 rounded-l-[99px] top-0 h-full ${theme.content_bg}`,
      currentTime: `opacity-60 text-[14px] font-semibold`,
      duration: `text-[14px] font-semibold`,
      icon: "w-[35px] max-[350px]:w-[25px]",
      before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
   };

   return (
      <div className={`relative h-full w-full ${className || ""}`}>
         {/* buttons */}
         <div className={`${classes.buttonsContainer}`}>
            {!admin && (
               <>
                  <button
                     className={`relative ${classes.button} ${
                        isRepeat !== "no" && theme.content_text
                     }`}
                     onClick={handleRepeatSong}
                  >
                     <ArrowPathRoundedSquareIcon className={classes.icon} />
                     <span className="absolute font-bold text-[12px] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
                        {currentSong.name &&
                           (isRepeat === "one" ? "1" : isRepeat === "all" ? "--" : "")}
                     </span>
                  </button>
                  <button className={classes.button} onClick={() => handlePrevious()}>
                     <BackwardIcon className={classes.icon} />
                  </button>

                  <PlayPauseButton handlePlayPause={handlePlayPause} />

                  <button className={`${classes.button}`} onClick={() => handleNext()}>
                     <ForwardIcon className={classes.icon} />
                  </button>
                  <button
                     className={`${classes.button} ${isShuffle && theme.content_text}`}
                     onClick={handleShuffle}
                  >
                     <ArrowTrendingUpIcon className={classes.icon} />
                  </button>
               </>
            )}
         </div>

         {/* process */}
         <div
            className={`${classes.processContainer} ${
               isError ? "opacity-[.6] pointer-events-none" : ""
            }`}
         >
            <div className="w-[45px]">
               {audioEle && (
                  <span ref={currentTimeRef} className={`${classes.currentTime}`}>
                     00:00
                  </span>
               )}
            </div>
            <div
               ref={durationLineRef}
               onClick={(e) => handleSeek(e)}
               className={`${classes.processLineBase} ${
                  !isLoaded && "pointer-events-none"
               }  ${classes.before}`}
            >
               <div
                  ref={timeProcessLine}
                  className={`${classes.processLineCurrent}`}
               ></div>
            </div>
            <div className="w-[46px] pl-[5px]">
               {audioEle && (
                  <span ref={remainingTimeRef} className={classes.duration}>
                     00:00
                  </span>
               )}
            </div>

            {admin && (
               <div className="flex items-center">
                  <PlayPauseButton handlePlayPause={handlePlayPause} />
                  {/* <button className={`${classes.button}`} onClick={() => handleNext()}>
                     <ForwardIcon className={classes.icon} />
                  </button> */}
               </div>
            )}
         </div>
         {!admin && (
            <Countdown
               isOpenFullScreen={isOpenFullScreen}
               cb={pause}
               play={play}
               isPlaying={isPlaying}
            />
         )}
      </div>
   );
}
