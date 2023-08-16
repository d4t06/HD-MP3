import {
   ArrowPathIcon,
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ForwardIcon,
   PauseCircleIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { FC, MouseEventHandler, RefObject } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import handleTimeText from "../../utils/handleTimeText";

type Props = {
   audioEle: HTMLAudioElement;
   isWaiting: boolean;
   isPlaying: boolean;

   handleSeek: MouseEventHandler;
   handlePrevious: () => void;
   handlePlayPause: () => void;
   handleNext: () => void;

   currentTimeRef: RefObject<HTMLDivElement>;
   durationLine: RefObject<HTMLDivElement>;
   timeProcessLine: RefObject<HTMLDivElement>;
};

const PlayerControl: FC<Props> = ({
   audioEle,
   isWaiting,
   isPlaying,

   handleSeek,
   handlePrevious,
   handlePlayPause,
   handleNext,

   currentTimeRef,
   durationLine,
   timeProcessLine,
}) => {
   const [isRepeat, setIsRepeat] = useLocalStorage<boolean>(
      "repeat",
      false
   );
   const [isShuffle, setIsShuffle] =
      useLocalStorage<boolean>("shuffle", false);

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
            <button
               className="w-12"
               onClick={() => handlePlayPause()}
            >
               {isWaiting ? (
                  <ArrowPathIcon
                     className={"w-6 mx-auto animate-spin"}
                  />
               ) : isPlaying ? (
                  <PauseCircleIcon
                     className={
                        "w-12 hover:text-indigo-600"
                     }
                  />
               ) : (
                  <PlayCircleIcon
                     className={
                        "w-12 h-12 hover:text-indigo-600"
                     }
                  />
               )}
            </button>
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
            <div className="w-[43px]">
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
            <div className="w-[33px]">
               {audioEle && (
                  <span>
                     {handleTimeText(audioEle?.duration!)}
                  </span>
               )}
            </div>
         </div>
      </>
   );
};

export default PlayerControl;
