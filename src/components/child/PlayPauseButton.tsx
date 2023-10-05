import {
   ArrowPathIcon,
   ExclamationCircleIcon,
   PauseCircleIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
   isWaiting: boolean;
   isPlaying: boolean;
   isError: boolean;
   handlePlayPause: () => void;
   hoverClasses?: string;
};

export default function PlayPauseButton({
   isWaiting,
   isPlaying,
   handlePlayPause,
   hoverClasses,
   isError,
}: Props) {
   return (
      <>
         <button
            className={`p-[5px] ${hoverClasses && hoverClasses} ${
               isWaiting && "pointer-events-none"
            } inline-flex items-center justify-center w-[50px]`}
            onClick={() => handlePlayPause()}
         >
            {isWaiting ? (
               <ArrowPathIcon className={"w-[30px] animate-spin"} />
            ) : isError ? (
              <ExclamationCircleIcon className="w-[30px]" />
              ) : isPlaying ? (
                <PauseCircleIcon className={"w-[50px]"} />
              ) : (
                <PlayCircleIcon className={"w-[50px]"} />
            )}
         </button>
      </>
   );
}
