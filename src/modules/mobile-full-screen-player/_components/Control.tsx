import { formatTime } from "@/utils/appHelpers";

// import { forwardRef} from "react";
import MenuButton from "./MenuBtn";
import PlayBtn from "./PlayBtn";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import { usePlayerContext } from "@/stores";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import CommentProvider from "@/modules/comment/components/CommentContext";
import { ProgressBar } from "@/components";

// export type ControlRef = {
// 	handlePlayPause: () => void;
// 	handleNext: () => void;
// 	pause: () => void;
// 	resetForNewSong: () => void;
// };

export default function MobileFullScreenControl() {
  const { timelineEleRef, currentTimeEleRef } = usePlayerContext();

  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);

  const { handleSeek, handlePlayPause } = usePlayerAction();

  const classes = {
    buttonsContainer: `w-full flex items-center justify-between space-x-2 mt-2`,
    progressContainer: `flex w-full flex-row items-center `,
  };

  return (
    <>
      {/* process */}
      <div
        className={`${classes.progressContainer}  ${playStatus === "error" || playStatus === "loading" ? "disable" : ""}`}
      >
        <div className="w-[44px] flex-shrink-0 sm:w-9">
          <span ref={currentTimeEleRef} className={`text-lg sm:text-sm`}>
            0:00
          </span>
        </div>

        <ProgressBar onClick={handleSeek} elelRef={timelineEleRef} className="h-1.5" />

        <div className="w-[44px] flex-shrink-0 sm:w-9 text-right">
          <span className={"text-lg sm:text-sm"}>
            {currentSongData?.song
              ? formatTime(currentSongData.song?.duration)
              : "0:00"}
          </span>
        </div>
      </div>

      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        <PlayBtn playStatus={playStatus} handlePlayPause={handlePlayPause} />

        <CommentProvider target="song">
          <MenuButton />
        </CommentProvider>
      </div>
    </>
  );
}

// export default forwardRef(MobileFullScreenControl);
