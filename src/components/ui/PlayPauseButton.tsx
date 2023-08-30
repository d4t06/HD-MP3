import Button from "./Button";
import {
  ArrowPathIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  isWaiting: boolean;
  isPlaying: boolean;
  handlePlayPause: () => void;
  hoverClasses: string
};

export default function PlayPauseButton ({
  isWaiting,
  isPlaying,
  handlePlayPause,
  hoverClasses
} : Props) {
  return (
    <Button className={"w-12 " +  hoverClasses}  onClick={() => handlePlayPause()}>
      {isWaiting ? (
        <ArrowPathIcon className={"w-6 mx-auto animate-spin"} />
      ) : isPlaying ? (
        <PauseCircleIcon className={"w-12"} />
      ) : (
        <PlayCircleIcon className={"w-12 h-12"} />
      )}
    </Button>
  );
};
