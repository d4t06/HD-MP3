import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { PlayStatus } from "@/stores/redux/PlayStatusSlice";

type Props = {
  handlePlayPause: () => void;
  playStatus: PlayStatus;
};

export default function PlayBtn({ handlePlayPause, playStatus }: Props) {
  const classes = {
    icon: "w-10",
  };

  const renderIcon = () => {
    switch (playStatus) {
      case "playing":
        return <PauseIcon className={`${classes.icon}`} />;
      case "error":
        return <ExclamationCircleIcon className={`${classes.icon}`} />;
      case "loading":
      case "waiting":
        return <ArrowPathIcon className={`${classes.icon} animate-spin`} />;
      case "paused":
        return <PlayIcon className={`${classes.icon}`} />;
    }
  };

  return (
    <>
      <button
        className={`inline-flex items-center justify-center`}
        onClick={() => handlePlayPause()}
      >
        {renderIcon()}
      </button>
    </>
  );
}

