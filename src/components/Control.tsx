import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../store";

import PlayPauseButton from "./child/PlayPauseButton";
import { useControl } from "../hooks";
import { formatTime } from "@/utils/appHelpers";
import { forwardRef, Ref, useImperativeHandle } from "react";

interface Props {
  admin?: boolean;
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
}

export type ControlRef = {
  handlePlayPause: () => void;
  handleNext: () => void;
};

function Control({ audioEle, admin, isOpenFullScreen }: Props, ref: Ref<ControlRef>) {
  const { theme } = useTheme();

  const {
    handleSeek,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleRepeatSong,
    handleShuffle,
    isRepeat,
    isShuffle,
    playStatus,
    currentSong,
    queueSongs,
    currentTimeEleRef,
    timelineEleRef,
  } = useControl({
    audioEle,
  });

  useImperativeHandle(ref, () => ({ handlePlayPause, handleNext }));

  const classes = {
    button: `p-1`,
    buttonsContainer: `w-full flex justify-center items-center mb-3 sm:mb-0 space-x-3 ${
      admin ? "hidden" : ""
    }`,
    progressContainer: `flex w-full flex-row items-center   ${admin ? "h-full" : ""}`,
    processLineBase: `h-[6px] sm:h-1 flex-grow relative cursor-pointer rounded-[99px] `,
    processLineCurrent: `absolute left-0 rounded-l-[99px] top-0 h-full ${theme.content_bg}`,
    currentTime: `opacity-60 text-[14px] font-semibold`,
    icon: "w-[44px] sm:w-7",
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
              <span className="absolute font-bold text-[12px] font-playwriteCU top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
                {currentSong &&
                  (isRepeat === "one" ? "1" : isRepeat === "all" ? "--" : "")}
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
          isOpenFullScreen ? "mb-0" : "mb-5 sm:mb-2"
        } ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
      >
        <div className="w-[44px] sm:w-[36px]">
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
        <div className="w-[44px] sm:w-[36px] text-right">
          <span className={"text-lg sm:text-sm"}>
            {currentSong ? formatTime(currentSong?.duration) : "0:00"}
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

export default forwardRef(Control);
