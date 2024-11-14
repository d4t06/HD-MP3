import { Dispatch, SetStateAction, memo, useMemo, useRef } from "react";
import { ChevronUpIcon, QueueListIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/store/ThemeContext";
import { useLocation } from "react-router-dom";

import { Control } from ".";

import SleepTimerButton from "./SleepTimerButton";
import MyTooltip from "./MyTooltip";
import SongInfo from "./SongInfo";
import { ControlRef } from "./Control";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/store/songQueueSlice";
import { VolumeButton } from "./VolumeButton";
import useThemeBgImage from "@/hooks/useThemeBgImage";
interface Props {
  admin?: boolean;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
  isOpenSongQueue: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  setIsOpenSongQueue: Dispatch<SetStateAction<boolean>>;
}

function BottomPlayer({
  idle,
  audioEle,
  admin,

  isOpenFullScreen,
  setIsOpenFullScreen,

  isOpenSongQueue,
  setIsOpenSongQueue,
}: Props) {
  const { theme } = useTheme();
  const { currentQueueId, currentSongData } = useSelector(selectSongQueue);

  const controlRef = useRef<ControlRef>(null);
  const { containerRef } = useThemeBgImage();

  const location = useLocation();

  const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const handleOpenFullScreen = () => {
    if (isOpenSongQueue) setIsOpenSongQueue(false);
    setIsOpenFullScreen(true);
  };

  const classes = {
    wrapper: `border-${theme.alpha} fixed bottom-0 w-full border-t transition-transform z-50 px-6 h-[90px]`,
    container: `flex flex-row gap-[10px] h-full items-center`,

    controlWrapper: `flex max-w-[420px] flex-grow`,
    controlWrapperChild_1: `${
      isOpenFullScreen
        ? "max-w-[600px] flex-col-reverse pb-[10px]"
        : "flex-col justify-center"
    }`,
    controlWrapperChild_2: `${!currentQueueId && "disable"}`,

    right: `${admin ? "w-1/4" : "w-1/4 "} flex items-center justify-end`,

    blurBg: `bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] absolute inset-0 ${theme.bottom_player_bg}`,
  };

  return (
    <div
      ref={containerRef}
      className={`${classes.wrapper} ${isOpenFullScreen ? "border-transparent" : theme.image ? theme.bottom_player_bg : '' } ${
        inEdit && "translate-y-[100%] "
      } `}
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
        <SongInfo
          song={currentSongData?.song}
          isOpenFullScreen={isOpenFullScreen}
          admin={admin}
        />

        {/* control */}
        <div
          className={` ${classes.controlWrapper} ${
            !admin ? classes.controlWrapperChild_1 : ""
          }  ${classes.controlWrapperChild_2}`}
        >
          <Control
            ref={controlRef}
            admin={admin}
            audioEle={audioEle}
            isOpenFullScreen={isOpenFullScreen}
          />
        </div>

        <div className={`${classes.right}  ${isOpenFullScreen ? "hidden" : ""}`}>
          <VolumeButton audioEle={audioEle} />

          {!admin && (
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

              <SleepTimerButton audioEle={audioEle} controlRef={controlRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(BottomPlayer);
