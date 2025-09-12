import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { PlayStatus } from "@/stores/redux/PlayStatusSlice";
import { forwardIcon } from "@/assets/icon";

type Props = {
  handlePlayPause: () => void;
  next: () => void;
  playStatus: PlayStatus;
};

export default function PlayBtn({ handlePlayPause, next, playStatus }: Props) {

  const renderIcon = () => {
    switch (playStatus) {
      case "playing":
        return <PauseIcon  />;
      case "error":
        return <ExclamationCircleIcon  />;
      case "loading":
      case "waiting":
        return <ArrowPathIcon className={`animate-spin`} />;
      case "paused":
        return <PlayIcon  />;
    }
  };

  return (
    <>
      <div className="flex">
        <button
          className="[&_svg]:w-10"
          onClick={handlePlayPause}
        >
          {renderIcon()}
        </button>

        <button onClick={next} className="w-10 ml-3">{forwardIcon}</button>
      </div>
    </>
  );
}
