import {
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ForwardIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, MouseEventHandler, RefObject, SetStateAction } from "react";
import handleTimeText from "../../utils/handleTimeText";
import PlayPauseButton from "./PlayPauseButton";
import { useTheme } from "../../store/ThemeContext";

type Props = {
   audioEle: HTMLAudioElement;
   isWaiting: boolean;
   isPlaying: boolean;

   isRepeat: boolean;
   setIsRepeat: Dispatch<SetStateAction<boolean>>;
   isShuffle: boolean;
   setIsShuffle: Dispatch<SetStateAction<boolean>>;

   handleSeek: MouseEventHandler;
   handlePrevious: () => void;
   handlePlayPause: () => void;
   handleNext: () => void;

   currentTimeRef: RefObject<HTMLDivElement>;
   durationLine: RefObject<HTMLDivElement>;
   timeProcessLine: RefObject<HTMLDivElement>;
};

export default function PlayerControl({
   audioEle,
   isWaiting,
   isPlaying,

   isRepeat,
   setIsRepeat,
   isShuffle,
   setIsShuffle,

   handleSeek,
   handlePrevious,
   handlePlayPause,
   handleNext,

   currentTimeRef,
   durationLine,
   timeProcessLine,
}: Props) {
   const { theme } = useTheme();
   

   const buttonClasses = `w-[28px] h-[28px]`;   

   return (
      <>
         {/* buttons */}
         <div
            className={`w-full flex flex-row justify-center items-center gap-x-[20px] h-[50px]`}
         >
            <button
               className={`${buttonClasses} ${theme.content_hover_text} ${
                  isRepeat && theme.content_text
               }`}
               onClick={() => setIsRepeat(!isRepeat)}
            >
               <ArrowPathRoundedSquareIcon />
            </button>
            <button
               className={buttonClasses + " " + theme.content_hover_text}
               onClick={() => handlePrevious()}
            >
               <BackwardIcon />
            </button>

            <PlayPauseButton
               hoverClasses={theme.content_hover_text}
               isWaiting={isWaiting}
               isPlaying={isPlaying}
               handlePlayPause={handlePlayPause}
            />

            <button onClick={() => handleNext()}>
               <ForwardIcon
                  className={buttonClasses + " " + theme.content_hover_text}
               />
            </button>
            <button
               className={`${buttonClasses} ${theme.content_hover_text} ${
                  isShuffle && theme.content_text
               }`}
               onClick={() => setIsShuffle(!isShuffle)}
            >
               <ArrowTrendingUpIcon />
            </button>
         </div>

         {/* process */}
         <div className="flex flex-row items-center h-[30px] gap-x-[5px]">
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
               className={`h-1 hover:h-[0.4rem flex-1 relative cursor-pointer rounded-3xl overflow-hidden 
                  ${theme.type === "light" ? "bg-gray-400" : "bg-gray-200"}
                  `}
            >
               <div
                  ref={timeProcessLine}
                  // style={{ backgroundColor: color }}
                  className={"absolute left-0 top-0 h-full " + theme.content_bg}
               ></div>
            </div>
            <div className="w-[45px]">
               {audioEle && (
                  <span className="text-[14px] font-semibold">
                     {handleTimeText(audioEle?.duration!) || "00:00"}
                  </span>
               )}
            </div>
         </div>
      </>
   );
}
