

import PlayPauseButton from "./_components/PlayPauseButton";
import { formatTime } from "@/utils/appHelpers";
import { usePlayerContext } from "@/stores";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import { ProgressBar } from "@/components";
import {
  forwardIcon,
  repeatIcon,
  repeatOneIcon,
  shuffleIcon,
} from "@/assets/icon";

export default function MusicControl() {
  const {
    playerConfig: { isShuffle, repeat },
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
    button: ``,
    buttonsContainer: `w-full flex justify-center items-center mb-3 sm:mb-0 space-x-3 [&_button]:w-10 [&_button]:h-10`,
    progressContainer: `flex w-full flex-row items-center `,
    icon: `w-full`,
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
          {repeat === "one" ? repeatOneIcon : repeatIcon}
        </button>
        <button
          disabled={queueSongs.length <= 1}
          className={`${classes.button} rotate-180`}
          onClick={previous}
        >
          {forwardIcon}
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
          {forwardIcon}
        </button>
        <button
          disabled={queueSongs.length <= 1}
          className={`${classes.button} ${isShuffle && "text-[--primary-cl]"}`}
          onClick={toggleShuffle}
        >
          {shuffleIcon}
        </button>
      </div>

      {/* process */}
      <div
        className={`${classes.progressContainer} ${
          isOpenFullScreen ? "mb-0" : "mb-5 sm:mb-2"
        } ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
      >
        <div className="w-[44px] flex-shrink-0 sm:w-9 font-bold">
          <span ref={currentTimeEleRef} className={`text-lg sm:text-sm`}>
            0:00
          </span>
        </div>

        <ProgressBar
          className="h-[6px] sm:h-1"
          onClick={handleSeek}
          elelRef={timelineEleRef}
        />

        <div className="w-[44px] flex-shrink-0 sm:w-9 text-right font-bold">
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
