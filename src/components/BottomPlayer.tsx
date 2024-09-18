import { Dispatch, SetStateAction, memo, useMemo, useRef } from "react";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChevronUpIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useTheme } from "@/store/ThemeContext";
import { useLocation } from "react-router-dom";

import { Control } from ".";

import useVolume from "../hooks/useVolume";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import SongInfo from "./SongInfo";
import { selectCurrentSong } from "@/store/currentSongSlice";
import SleepTimerButton from "./SleepTimerButton";
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
  const { currentSong } = useSelector(selectCurrentSong);
  const {
    playStatus: { isPlaying, isWaiting },
  } = useSelector(selectAllPlayStatusStore);

  const volumeLine = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { handleSetVolume, isMute, handleMute, handleWheel } = useVolume(
    volumeLine,
    audioEle
  );

  const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const handleOpenFullScreen = () => {
    if (isOpenSongQueue) setIsOpenSongQueue(false);
    setIsOpenFullScreen(true);
  };

  const classes = {
    before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
    wrapper: `border-${
      theme.alpha
    } fixed bottom-0 w-full border-t transition-transform z-50 px-10 ${
      admin ? "h-[60px]" : "h-[90px]"
    }`,
    container: `flex flex-row gap-[10px] h-full items-center`,

    controlWrapper: `flex max-w-[450px] flex-grow`,
    controlWrapperChild_1: `${
      isOpenFullScreen
        ? "max-w-[600px] flex-col-reverse pb-[10px]"
        : "flex-col justify-center"
    }`,
    controlWrapperChild_2: `${!currentSong.song_url && "disable"}`,

    right: `${admin ? "w-1/4" : "w-1/4 "} flex items-center justify-end`,
    volumeLineBase: `ml-1 w-full relative h-[4px] cursor-pointer rounded-full`,
    volumeLineCurrent: `absolute left-0 top-0 h-full w-full `,

    blurBg: `bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] absolute inset-0 ${theme.bottom_player_bg}`,
  };

  return (
    <div
      className={`${classes.wrapper} ${isOpenFullScreen && "border-transparent"} ${
        inEdit && "translate-y-[100%] "
      } bg-transparent`}
    >
      <div
        className={`${classes.blurBg} ${
          isOpenFullScreen ? "opacity-0 transition-opacity delay-[.2s]" : ""
        }`}
      ></div>
      <div
        className={`${classes.container} ${
          isOpenFullScreen ? "justify-center text-white" : "justify-between"
        } ${idle && "transition-opacity duration-[.3s] opacity-0"}`}
      >
        <SongInfo isOpenFullScreen={isOpenFullScreen} admin={admin} />

        {/* control */}
        <div
          className={` ${classes.controlWrapper} ${
            !admin ? classes.controlWrapperChild_1 : ""
          }  ${classes.controlWrapperChild_2}`}
        >
          {useMemo(
            () => (
              <Control
                admin={admin}
                audioEle={audioEle}
                idle={false}
                isOpenFullScreen={isOpenFullScreen}
              />
            ),
            [isPlaying, isOpenFullScreen, isWaiting]
          )}
        </div>

        <div className={`${classes.right}  ${isOpenFullScreen ? "hidden" : ""}`}>
          <div className="flex flex-grow items-center max-w-[120px] mr-2">
            <button onWheel={handleWheel} onClick={() => handleMute()}>
              {isMute ? (
                <SpeakerXMarkIcon className="w-6" />
              ) : (
                <SpeakerWaveIcon className="w-6" />
              )}
            </button>
            <div
              onClick={(e) => handleSetVolume(e)}
              ref={volumeLine}
              className={`${classes.volumeLineBase} ${classes.before}`}
              style={{ background: `#e1e1e1` }}
            ></div>
          </div>

          {!admin && (
            <div className={`flex items-center ${currentSong.name ? '' : 'disable'}`}>
              <Tooltip placement="top">
                <TooltipTrigger
                  onClick={handleOpenFullScreen}
                  className={` ml-1 rounded-[99px]  hover:bg-${theme.alpha}  p-[5px]`}
                >
                  <ChevronUpIcon className="w-6" />
                </TooltipTrigger>

                <TooltipContent>Fullscreen mode</TooltipContent>
              </Tooltip>

              <Tooltip placement="top">
                <TooltipTrigger
                  onClick={() => setIsOpenSongQueue(!isOpenSongQueue)}
                  className={` hover:bg-${theme.alpha} rounded-md p-[5px]`}
                >
                  <QueueListIcon className="w-6" />
                </TooltipTrigger>

                <TooltipContent>Queue</TooltipContent>
              </Tooltip>

              <div className={`w-[2px] h-[26px] mx-3 bg-${theme.alpha}`}></div>

              <SleepTimerButton variant="desktop" audioEle={audioEle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(BottomPlayer);
