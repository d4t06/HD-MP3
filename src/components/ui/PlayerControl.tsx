import {
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ForwardIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, FC, MouseEventHandler, RefObject, SetStateAction } from "react";
import handleTimeText from "../../utils/handleTimeText";
import PlayPauseButton from "./PlayPauseButton";

type Props = {
   reverse:boolean;

   audioEle: HTMLAudioElement;
   isWaiting: boolean;
   isPlaying: boolean;


   isRepeat: boolean,
   setIsRepeat: Dispatch<SetStateAction<boolean>>,
   isShuffle: boolean,
   setIsShuffle: Dispatch<SetStateAction<boolean>>,

   handleSeek: MouseEventHandler;
   handlePrevious: () => void;
   handlePlayPause: () => void;
   handleNext: () => void;

   currentTimeRef: RefObject<HTMLDivElement>;
   durationLine: RefObject<HTMLDivElement>;
   timeProcessLine: RefObject<HTMLDivElement>;
};

const PlayerControl: FC<Props> = ({
   reverse,

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
}) => {

   const buttonClasses = "w-6 h-6 hover:text-indigo-600";

   return (
      <>
         {/* buttons */}
         <div
            className={`w-full flex flex-row justify-center items-center gap-x-10 h-[40px]`}
         >
            <button onClick={() => setIsRepeat(!isRepeat)}>
               <ArrowPathRoundedSquareIcon
                  className={
                     buttonClasses +
                     `${isRepeat ? " text-indigo-600" : ""}`
                  }
               />
            </button>
            <button onClick={() => handlePrevious()}>
               <BackwardIcon className={buttonClasses} />
            </button>
            
            <PlayPauseButton isWaiting={isWaiting} isPlaying={isPlaying} handlePlayPause={handlePlayPause}/>

            <button onClick={() => handleNext()}>
               <ForwardIcon className={buttonClasses} />
            </button>
            <button
               onClick={() => setIsShuffle(!isShuffle)}
            >
               <ArrowTrendingUpIcon
                  className={
                     buttonClasses +
                     `${
                        isShuffle ? " text-indigo-600" : ""
                     }`
                  }
               />
            </button>
         </div>

         {/* process */}
         <div className="flex flex-row items-center h-[30px] gap-x-[5px]">
            <div className="w-40px]">
               {audioEle && (
                  <span
                     ref={currentTimeRef}
                     className="text-gray-500"
                  >
                     00:00
                  </span>
               )}
            </div>
            <div
               ref={durationLine}
               onClick={(e) => handleSeek(e)}
               className="h-1 hover:h-[0.4rem] bg-gray-300 flex-1 relative cursor-pointer rounded-3xl overflow-hidden"
            >
               <div
                  ref={timeProcessLine}
                  className="absolute left-0 top-0 h-full bg-indigo-600"
               ></div>
            </div>
            <div className="w-[40px]">
               {audioEle && (
                  <span>
                     {handleTimeText(audioEle?.duration!) || '00:00'}
                  </span>
               )}
            </div>
         </div>
      </>
   );
};

export default PlayerControl;
