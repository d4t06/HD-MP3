import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/outline";
// import { useSelector } from "react-redux";
import { PlayStatus } from "@/store/PlayStatusSlice";

type Props = {
  handlePlayPause: () => void;
  playStatus: PlayStatus;
};

function PlayPauseButton({ handlePlayPause, playStatus }: Props) {
  // const {
  //   playStatus: { playStatus },
  // } = useSelector(selectAllPlayStatusStore);

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
        return <ArrowPathIcon className={`${classes.icon} animate-spin`} />;
      case "paused":
        return <PlayCircleIcon className={`${classes.icon}`} />;
    }
  };


  console.log('chekc status', playStatus);
  

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
