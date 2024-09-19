import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { selectCurrentSong } from "@/store/currentSongSlice";

type Props = {
  handlePlayPause: () => void;
};
function PlayPauseButton({ handlePlayPause }: Props) {
  const {
    playStatus: { isError, isPlaying, isWaiting },
  } = useSelector(selectAllPlayStatusStore);
  const { currentSong } = useSelector(selectCurrentSong);


  const classes ={
    icon: 'w-[50px] sm:w-10'
  }

  const renderIcon = useMemo(() => {
    if (isWaiting) {
      return <ArrowPathIcon className={`${classes.icon} animate-spin`} />;
    } else if (isError && currentSong.name) {
      return <ExclamationCircleIcon className={`${classes.icon}`} />;
    }

    return isPlaying ? (
      <PauseCircleIcon className={`${classes.icon}`} />
    ) : (
      <PlayCircleIcon className={`${classes.icon}`} />
    );
  }, [isWaiting, isError, isPlaying, currentSong]);

  return (
    <>
      <button
        className={`p-1 ${
          isWaiting && "pointer-events-none"
        } inline-flex items-center justify-center`}
        onClick={() => handlePlayPause()}
      >
        {renderIcon}
      </button>
    </>
  );
}

export default memo(PlayPauseButton);
