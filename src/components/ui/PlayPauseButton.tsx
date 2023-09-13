import {
  PauseCircleIcon,
  PlayCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

type Props = {
  isWaiting: boolean;
  isPlaying: boolean;
  handlePlayPause: () => void;
  hoverClasses?: string
};

export default function PlayPauseButton ({
  isWaiting,
  isPlaying,
  handlePlayPause,
  hoverClasses
} : Props) {
  return (
    <>
    <button className={`p-[5px] ${hoverClasses && hoverClasses} ${isWaiting && 'pointer-events-none'}`}  onClick={() => handlePlayPause()}>
      {isWaiting ? (
        <TruckIcon className={"w-[50px] scale-75"} />
      ) : isPlaying ? (
        <PauseCircleIcon className={"w-[50px]"} />
      ) : (
        <PlayCircleIcon className={"w-[50px]"} />
      )}
    </button>
    </>
  );
};
