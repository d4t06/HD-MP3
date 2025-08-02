import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";

import PlayPauseButton from "./_components/PlayPauseButton";
import { formatTime } from "@/utils/appHelpers";
import { usePlayerContext } from "@/stores";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import { ProgressBar } from "@/components";


export default function MusicControl() {
  const {
    playerConig: { isShuffle, repeat },
    isOpenFullScreen,
    timelineEleRef,
    currentTimeEleRef,
  } = usePlayerContext();
  const { currentSongData, queueSongs } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const {
    next,
    previous,
    toggleRepeat,
    toggleShuffle,
    handlePlayPause,
    handleSeek,
  } = usePlayerAction();

  const classes = {
    button: `p-1 rounded-full md:bg-transparent `,
    buttonsContainer: `w-full flex justify-center items-center mb-3 sm:mb-0 space-x-3`,
    progressContainer: `flex w-full flex-row items-center `,
    icon: `w-[44px] sm:w-7`,
    before: `before:content-[''] before:w-[100%] before:h-[24px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
  };

  return (
    <>
      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        <button
          disabled={queueSongs.length <= 1}
          className={`relative ${classes.button} ${
            repeat !== "no" && "text-[--primary-cl]"
          }`}
          onClick={toggleRepeat}
        >
          <ArrowPathRoundedSquareIcon className={classes.icon} />
          <span className="absolute font-bold text-[12px] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
            {repeat === "one" ? "1" : repeat === "all" ? "-" : ""}
          </span>
        </button>
        <button
          disabled={queueSongs.length <= 1}
          className={classes.button}
          onClick={previous}
        >
          <BackwardIcon className={classes.icon} />
        </button>

        <PlayPauseButton
          playStatus={playStatus}
          handlePlayPause={handlePlayPause}
        />

        <button
          disabled={queueSongs.length <= 1}
          className={`${classes.button}`}
          onClick={next}
        >
          <ForwardIcon className={classes.icon} />
        </button>
        <button
          disabled={queueSongs.length <= 1}
          className={`${classes.button} ${isShuffle && "text-[--primary-cl]"}`}
          onClick={toggleShuffle}
        >
          <ArrowTrendingUpIcon className={classes.icon} />
        </button>
      </div>

      {/* process */}
      <div
        className={`${classes.progressContainer} ${
          isOpenFullScreen ? "mb-0" : "mb-5 sm:mb-2"
        } ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
      >
        <div className="w-[44px] sm:w-9">
          <span ref={currentTimeEleRef} className={`text-lg sm:text-sm`}>
            0:00
          </span>
        </div>

        <ProgressBar
          className="h-[6px] sm:h-1"
          onClick={handleSeek}
          elelRef={timelineEleRef}
        />

        <div className="w-[44px] sm:w-9 text-right">
          <span className={"text-lg sm:text-sm"}>
            {currentSongData?.song
              ? formatTime(currentSongData.song?.duration)
              : "0:00"}
          </span>
        </div>
      </div>
    </>
  );
}

// export default forwardRef(MusicControl);
