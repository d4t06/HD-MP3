import { FC } from "react";
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
};

const PlayPauseButton: FC<Props> = ({
  isWaiting,
  isPlaying,
  handlePlayPause,
}) => {
  return (
    <Button className="w-12" onClick={() => handlePlayPause()}>
      {isWaiting ? (
        <ArrowPathIcon className={"w-6 mx-auto animate-spin"} />
      ) : isPlaying ? (
        <PauseCircleIcon className={"w-12 hover:text-indigo-600"} />
      ) : (
        <PlayCircleIcon className={"w-12 h-12 hover:text-indigo-600"} />
      )}
    </Button>
  );
};

export default PlayPauseButton;
