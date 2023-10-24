import {
   ArrowPathIcon,
   ExclamationCircleIcon,
   PauseCircleIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Song } from "../../types";

type Props = {
   isWaiting: boolean;
   isPlaying: boolean;
   isError: boolean;
   handlePlayPause: () => void;
   hoverClasses?: string;
   songInStore: Song;
};

export default function PlayPauseButton({
   isWaiting,
   isPlaying,
   handlePlayPause,
   hoverClasses,
   isError,
   songInStore,
}: Props) {

   const renderIcon = useMemo(() => {
      if (isWaiting) {
         return <ArrowPathIcon className={"w-[36px] max-[549px]:w-[46px] animate-spin"} />;
      } else if (isError && songInStore.name) {
         return <ExclamationCircleIcon className="w-[30px] max-[549px]:w-[40px]" />;
      }

      return isPlaying ? (
         <PauseCircleIcon className={"w-[50px] max-[549px]:w-[60px]"} />
      ) : (
         <PlayCircleIcon className={"w-[50px] max-[549px]:w-[60px]"} />
      );
   }, [isWaiting, isError, isPlaying]);

   return (
      <>
         <button
            className={`p-[5px] ${hoverClasses && hoverClasses} ${
               isWaiting && "pointer-events-none"
            } inline-flex items-center justify-center w-[50px] max-[549px]:w-[60px]`}
            onClick={() => handlePlayPause()}
         >
            {renderIcon}
         </button>
      </>
   );
}
