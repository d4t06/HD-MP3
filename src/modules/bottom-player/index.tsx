import { useMemo } from "react";
import { ChevronUpIcon, QueueListIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { usePlayerContext, useThemeContext } from "@/stores";
import { getDisable } from "@/utils/appHelpers";
import SongInfo from "./_components/SongInfo";
import { VolumeButton } from "./_components/VolumeButton";
import MyTooltip from "@/components/MyTooltip";
import MusicControl from "../music-control";
import useThemeBgImage from "./_hooks/useThemeBgImage";
import SleepTimerButton from "../sleep-timer-button";

export default function BottomPlayer() {
  const { audioRef, idle } = usePlayerContext();
  if (!audioRef.current) throw new Error("BottomPlayer !audioRef.current");

  const { theme } = useThemeContext();
  const {
    isOpenFullScreen,
    controlRef,
    isOpenSongQueue,
    setIsOpenFullScreen,
    setIsOpenSongQueue,
  } = usePlayerContext();
  const { currentQueueId, currentSongData } = useSelector(selectSongQueue);

  const { containerRef } = useThemeBgImage();

  const location = useLocation();

  const inEdit = useMemo(() => location.pathname.includes("lyric"), [location]);

  const handleOpenFullScreen = () => {
    if (isOpenSongQueue) setIsOpenSongQueue(false);
    setIsOpenFullScreen(true);
  };

  const classes = {
    wrapper: `hidden md:block border-${theme.alpha} fixed bottom-0 w-full border-t transition-transform z-50 md:px-3 lg:px-6 h-[90px]`,
    container: `flex flex-row gap-[10px] h-full items-center`,

    controlWrapper: `flex max-w-[420px] flex-grow ${
      isOpenFullScreen
        ? "max-w-[600px] flex-col-reverse pb-[10px]"
        : "flex-col justify-center"
    }`,
    right: `w-1/4 flex items-center justify-end`,
    blurBg: `bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] absolute inset-0 ${theme.bottom_player_bg}`,
  };

  return (
    <div
      ref={containerRef}
      className={`${classes.wrapper} ${
        isOpenFullScreen
          ? "border-transparent"
          : theme.image
            ? theme.bottom_player_bg
            : ""
      } ${inEdit && "translate-y-[100%] "} `}
    >
      {!theme.image && (
        <div
          className={`${classes.blurBg} ${
            isOpenFullScreen ? "opacity-0 transition-opacity delay-[.2s]" : ""
          }`}
        ></div>
      )}
      <div
        className={`${classes.container} ${
          isOpenFullScreen ? "justify-center text-white" : "justify-between"
        } ${idle && "transition-opacity duration-[.3s] opacity-0"}`}
      >
        <SongInfo song={currentSongData?.song} isOpenFullScreen={isOpenFullScreen} />

        {/* control */}
        <div
          className={` ${classes.controlWrapper} ${getDisable(currentQueueId === null)}`}
        >
          <MusicControl variant="desktop" ref={controlRef} />
        </div>

        <div className={`${classes.right}  ${isOpenFullScreen ? "hidden" : ""}`}>
          <VolumeButton audioEle={audioRef.current} />

          <div className={`flex items-center ${!currentQueueId ? "disable" : ""}`}>
            <MyTooltip content="Fullscreen mode">
              <button
                onClick={handleOpenFullScreen}
                className={`rounded-[99px]  hover:bg-${theme.alpha}  p-[5px]`}
              >
                <ChevronUpIcon className="w-6" />
              </button>
            </MyTooltip>

            <MyTooltip content="Queue">
              <button
                onClick={() => setIsOpenSongQueue(!isOpenSongQueue)}
                className={`ml-1 hover:bg-${theme.alpha} rounded-md p-[5px]`}
              >
                <QueueListIcon className="w-6" />
              </button>
            </MyTooltip>

            <div className={`w-[2px] h-[26px] ml-2 bg-${theme.alpha}`}></div>

            <SleepTimerButton />
          </div>
        </div>
      </div>
    </div>
  );
}
