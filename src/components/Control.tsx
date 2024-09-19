import { useRef } from "react";
import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../store";

import PlayPauseButton from "./child/PlayPauseButton";
import useAudioEvent from "../hooks/useAudioEvent";
import useAudioControl from "@/hooks/useAudioControl";

interface Props {
  admin?: boolean;
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
}

export default function Control({ audioEle, admin, isOpenFullScreen }: Props) {
  const { theme } = useTheme();

  // ref
  const timelineRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const remainingTimeRef = useRef<HTMLDivElement>(null);

  const {
    handleNext,
    handlePrevious,
    handleRepeatSong,
    handleShuffle,
    playStatus: { isRepeat, isShuffle, isError, isWaiting },
    currentSong,
    queueSongs,
  } = useAudioControl({
    audioEle,
  });

  const { handleSeek, handlePlayPause } = useAudioEvent({
    audioEle,
    timelineRef,
    currentTimeRef,
    remainingTimeRef,
  });

  const classes = {
    button: `p-1`,
    buttonsContainer: `w-full flex justify-center items-center space-x-3`,
    progressContainer: `flex w-full flex-row items-center mb-5 ${isOpenFullScreen ? 'mb-0' : 'sm:mb-2'}  ${
      admin ? "h-full" : ""
    }`,
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
                {currentSong.name &&
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

            <PlayPauseButton handlePlayPause={handlePlayPause} />

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
      <div className={`${classes.progressContainer} ${isError ? "disable" : ""}`}>
        <div className="w-[44px] sm:w-[36px]">
          {audioEle && (
            <span ref={currentTimeRef} className={`text-lg sm:text-sm`}>
              0:00
            </span>
          )}
        </div>
        <div
          ref={timelineRef}
          style={{background: '#e1e1e1'}}
          onClick={(e) => handleSeek(e)}
          className={`${classes.processLineBase} ${isWaiting ? "disable" : ""}  ${
            classes.before
          }`}
        ></div>
        <div className="w-[44px] sm:w-[36px] text-right">
          {audioEle && (
            <span ref={remainingTimeRef} className={"text-lg sm:text-sm"}>
              0:00
            </span>
          )}
        </div>

        {admin && (
          <div className="flex items-center">
            <PlayPauseButton handlePlayPause={handlePlayPause} />
          </div>
        )}
      </div>
    </>
  );
}
