import { useCallback, useRef } from "react";
import {
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ForwardIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, useTheme, useActuallySongs } from "../store";

import PlayPauseButton from "./child/PlayPauseButton";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { Countdown } from "./";
import useControl from "../hooks/useControl";

interface Props {
   admin?: boolean;
   audioEle: HTMLAudioElement;
   idle: boolean;
   isOpenFullScreen: boolean;
}

export default function Control({ audioEle, admin, isOpenFullScreen }: Props) {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { actuallySongs } = useActuallySongs();
   const {
      playStatus: { isPlaying, isRepeat, isShuffle, isError },
   } = useSelector(selectAllPlayStatusStore);
   const { song: songInStore } = useSelector(selectAllSongStore);

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

      localStorage.setItem("isRepeat", value);
      dispatch(setPlayStatus({ isRepeat: value }));
   };

   const handleSuffle = () => {
      const newValue = !isShuffle;
      dispatch(setPlayStatus({ isShuffle: newValue }));
      localStorage.setItem("isShuffle", JSON.stringify(newValue));
   };

   const classes = {
      button: `p-[5px] ${actuallySongs.length <= 1 && "opacity-20 pointer-events-none"}`,
      buttonsContainer: `w-full flex justify-center items-center gap-x-[20px] ${admin ? "" : "h-[50px]"}`,
      processContainer: `flex w-full flex-row items-center h-[30px] ${admin ? "h-full" : ""}`,
      processLineBase: `h-[4px] flex-grow relative cursor-pointer rounded-[99px] bg-gray-200 `,
      processLineCurrent: `absolute left-0 rounded-l-[99px] top-0 h-full ${theme.content_bg}`,
      currentTime: `opacity-60 text-[14px] font-semibold`,
      duration: `text-[14px] font-semibold`,
      icon: "w-[30px] max-[350px]:w-[25px]",
      before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
   };

   return (
      <div className="relative h-full w-full">
         {/* buttons */}
         <div className={`${classes.buttonsContainer}`}>
            {!admin && (
               <>
                  <button
                     className={`relative ${classes.button} ${isRepeat !== "no" && theme.content_text}`}
                     onClick={handleRepeatSong}
                  >
                     <ArrowPathRoundedSquareIcon className={classes.icon} />
                     <span className="absolute font-bold text-[12px] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
                        {songInStore.name && (isRepeat === "one" ? "1" : isRepeat === "all" ? "--" : "")}
                     </span>
                  </button>
                  <button className={classes.button} onClick={() => handlePrevious()}>
                     <BackwardIcon className={classes.icon} />
                  </button>

                  <PlayPauseButton handlePlayPause={handlePlayPause} />

                  <button className={`${classes.button}`} onClick={() => handleNext()}>
                     <ForwardIcon className={classes.icon} />
                  </button>
                  <button className={`${classes.button} ${isShuffle && theme.content_text}`} onClick={handleSuffle}>
                     <ArrowTrendingUpIcon className={classes.icon} />
                  </button>
               </>
            )}
         </div>

         {/* process */}
         <div className={`${classes.processContainer} ${isError ? "opacity-[.6] pointer-events-none" : ""}`}>
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
               className={`${classes.processLineBase} ${!isLoaded && "pointer-events-none"}  ${classes.before}`}
            >
               <div ref={timeProcessLine} className={`${classes.processLineCurrent}`}></div>
            </div>
            <div className="w-[55px] pl-[5px]">
               {audioEle && (
                  <span ref={remainingTimeRef} className={classes.duration}>
                     00:00
                  </span>
               )}
            </div>

            {admin && (
               <div className="flex items-center">
                  <PlayPauseButton handlePlayPause={handlePlayPause} />
                  <button className={`${classes.button}`} onClick={() => handleNext()}>
                     <ForwardIcon className={classes.icon} />
                  </button>
               </div>
            )}
         </div>
         {!admin && <Countdown isOpenFullScreen={isOpenFullScreen} cb={pause} play={play} isPlaying={isPlaying} />}
      </div>
   );
}
