import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";

import PlayPauseButton from "./_components/PlayPauseButton";
import { formatTime } from "@/utils/appHelpers";
import { forwardRef, Ref, useImperativeHandle } from "react";
import { useThemeContext } from "@/stores";
import useControl from "./_hooks/useControl";

interface Props {
  admin?: boolean;
  variant: "mobile" | "desktop";
}

export type ControlRef = {
  handlePlayPause: () => void;
  handleNext: () => void;
  pause: () => void;
  resetForNewSong: () => void;
};

function MusicControl({ admin, variant }: Props, ref: Ref<ControlRef>) {
  const { theme } = useThemeContext();

  const {
    isOpenFullScreen,
    currentSongData,
    handleSeek,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleRepeatSong,
    handleShuffle,
    isRepeat,
    isShuffle,
    playStatus,
    queueSongs,
    currentTimeEleRef,
    timelineEleRef,
    resetForNewSong,
    pause,
  } = useControl();

  useImperativeHandle(ref, () => ({
    handlePlayPause,
    handleNext,
    pause,
    resetForNewSong,
  }));

  const classes = {
    button: `p-1 rounded-full md:bg-transparent `,
    buttonsContainer: `w-full flex justify-center items-center mb-3 sm:mb-0 space-x-3 ${
      admin ? "hidden" : ""
    }`,
    progressContainer: `flex w-full flex-row items-center   ${admin ? "h-full" : ""}`,
    processLineBase: `h-[6px] sm:h-1 flex-grow relative cursor-pointer rounded-[99px] shadow-[2px_2px_10px_rgba(0,0,0,.15)] `,
    icon: `w-[44px] sm:w-7`,
    before: `before:content-[''] before:w-[100%] before:h-[24px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
  };

  return (
    <>
      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        {!admin && (
          <>
            <button
              disabled={queueSongs.length <= 1}
              className={`relative ${classes.button} ${
                isRepeat !== "no" && theme.content_text
              }`}
              onClick={handleRepeatSong}
            >
              <ArrowPathRoundedSquareIcon className={classes.icon} />
              <span className="absolute font-bold text-[12px] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
                {isRepeat === "one" ? "1" : isRepeat === "all" ? "-" : ""}
              </span>
            </button>
            <button
              disabled={queueSongs.length <= 1}
              className={classes.button}
              onClick={() => handlePrevious()}
            >
              <BackwardIcon className={classes.icon} />
            </button>

            <PlayPauseButton playStatus={playStatus} handlePlayPause={handlePlayPause} />

            <button
              disabled={queueSongs.length <= 1}
              className={`${classes.button}`}
              onClick={() => handleNext()}
            >
              <ForwardIcon className={classes.icon} />
            </button>
            <button
              disabled={queueSongs.length <= 1}
              className={`${classes.button} ${isShuffle && theme.content_text}`}
              onClick={handleShuffle}
            >
              <ArrowTrendingUpIcon className={classes.icon} />
            </button>
          </>
        )}
      </div>

      {/* process */}
      <div
        className={`${classes.progressContainer} ${
          variant === "desktop" && isOpenFullScreen ? "mb-0" : "mb-5 sm:mb-2"
        } ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
      >
        <div className="w-[44px] sm:w-9">
          <span ref={currentTimeEleRef} className={`text-lg sm:text-sm`}>
            0:00
          </span>
        </div>
        <div
          ref={timelineEleRef}
          style={{ background: "rgba(255, 255, 255, 0.3)" }}
          onClick={(e) => handleSeek(e)}
          className={`${classes.processLineBase} ${false ? "disable" : ""} ${
            classes.before
          }`}
        ></div>
        <div className="w-[44px] sm:w-9 text-right">
          <span className={"text-lg sm:text-sm"}>
            {currentSongData?.song ? formatTime(currentSongData.song?.duration) : "0:00"}
          </span>
        </div>

        {admin && (
          <div className="flex items-center ml-3">
            <PlayPauseButton playStatus={playStatus} handlePlayPause={handlePlayPause} />
          </div>
        )}
      </div>
    </>
  );
}

export default forwardRef(MusicControl);
