import { formatTime } from "@/utils/appHelpers";

import MenuButton from "./MenuBtn";
import PlayBtn from "./PlayBtn";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import { usePlayerContext } from "@/stores";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import CommentProvider from "@/modules/comment/components/CommentContext";
import { ProgressBar } from "@/components";

export default function MobileFullScreenControl() {
  const { timelineEleRef, currentTimeEleRef } = usePlayerContext();

  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);

  const { handleSeek, handlePlayPause, next } = usePlayerAction();

  const classes = {
    buttonsContainer: `w-full flex items-center justify-between space-x-2 mt-2`,
    progressContainer: `flex w-full flex-row items-center px-2`,
  };

  return (
    <>
      {/* process */}
      <div
        className={`${classes.progressContainer}  ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
      >
        <div className="w-10 flex-shrink-0 sm:w-9">
          <span ref={currentTimeEleRef} className={`font-semibold`}>
            0:00
          </span>
        </div>

        <ProgressBar
          onClick={handleSeek}
          elelRef={timelineEleRef}
          className="h-1.5 mb-1"
        />

        <div className="w-10 flex-shrink-0 sm:w-9 text-right">
          <span className={"font-semibold opacity-80"}>
            {currentSongData?.song
              ? formatTime(currentSongData.song?.duration)
              : "0:00"}
          </span>
        </div>
      </div>

      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        <PlayBtn playStatus={playStatus} next={next} handlePlayPause={handlePlayPause} />

        <CommentProvider target="song">
          <MenuButton />
        </CommentProvider>
      </div>
    </>
  );
}
