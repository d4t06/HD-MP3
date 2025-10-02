import { PlayStatus } from "@/stores/redux/PlayStatusSlice";
import {
  PauseIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";

type Props = {
  handlePlayPause: () => void;
  playStatus: PlayStatus;
};

function PlayPauseButton({ handlePlayPause, playStatus }: Props) {
  const renderIcon = () => {
    switch (playStatus) {
      case "playing":
        return <PauseIcon />;
      case "error":
        return <ExclamationCircleIcon />;
      case "loading":
      case "waiting":
        return <ArrowPathIcon className={`animate-spin`} />;
      case "paused":
        return <PlayIcon />;
    }
  };

  return (
    <>
      <button
        className={`rounded-full  inline-flex items-center w-10 h-10 p-1 justify-center [&_svg]:w-full`}
        onClick={() => handlePlayPause()}
      >
        {renderIcon()}
      </button>
    </>
  );
}

export default PlayPauseButton;
