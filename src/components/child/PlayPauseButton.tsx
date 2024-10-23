import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";

type Props = {
  handlePlayPause: () => void;
};
function PlayPauseButton({ handlePlayPause }: Props) {
  const {
    playStatus: { playStatus },
  } = useSelector(selectAllPlayStatusStore);
  //
  const classes = {
    icon: "w-[50px] sm:w-10",
  };

  const renderIcon = useMemo(() => {
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
  }, [playStatus]);


  console.log("check play status", playStatus)

  return (
    <>
      <button
        className={`p-1 ${
          playStatus === "loading" && "disable"
        } inline-flex items-center justify-center`}
        onClick={() => handlePlayPause()}
      >
        {renderIcon}
      </button>
    </>
  );
}

export default memo(PlayPauseButton);
