import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/outline";
import { PlayStatus } from "@/stores/redux/PlayStatusSlice";

type Props = {
  handlePlayPause: () => void;
  playStatus: PlayStatus;
};

function PlayPauseButton({ handlePlayPause, playStatus }: Props) {
  const classes = {
    icon: "w-[50px] sm:w-10",
  };

  const renderIcon = () => {
    switch (playStatus) {
      case "playing":
        return <PauseCircleIcon className={`${classes.icon}`} />;
      case "error":
        return <ExclamationCircleIcon className={`${classes.icon}`} />;
      case "loading":
      case "waiting":
        return <ArrowPathIcon className={`${classes.icon} animate-spin`} />;
      case "paused":
        return <PlayCircleIcon className={`${classes.icon}`} />;
    }
  };

  return (
    <>
      <button
        className={`p-1  inline-flex items-center justify-center`}
        onClick={() => handlePlayPause()}
      >
        {renderIcon()}
      </button>
    </>
  );
}

export default PlayPauseButton;
