import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import {
  ChevronUpIcon,
  QueueListIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";
import { useLocation } from "react-router-dom";

import { ScrollText, Image, Control, Button } from ".";

import useVolume from "../hooks/useVolume";
import zingIcon from "../assets/icon-zing.svg";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";

interface Props {
  admin?: boolean;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
  isOpenSongQueue: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  setIsOpenSongQueue: Dispatch<SetStateAction<boolean>>;
}

export default function BottomPlayer({
  idle,
  audioEle,
  admin,

  isOpenFullScreen,
  setIsOpenFullScreen,

  isOpenSongQueue,
  setIsOpenSongQueue,
}: Props) {
  const { theme } = useTheme();
  const { song: songInStore } = useSelector(selectAllSongStore);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const volumeLineWidth = useRef<number>();
  const volumeLine = useRef<HTMLDivElement>(null);
  const volumeProcessLine = useRef<HTMLDivElement>(null);

  // use hooks
  const location = useLocation();
  const { handleSetVolume, isMute, handleMute } = useVolume(
    volumeLineWidth,
    volumeProcessLine,
    audioEle
  );
  const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const handleOpenFullScreen = () => {
    if (isOpenSongQueue) setIsOpenSongQueue(false);
    setIsOpenFullScreen(true);
  };

  // update process lines width
  useEffect(() => {
    volumeLineWidth.current = volumeLine.current?.offsetWidth;
  }, [isOpenFullScreen]);

  const classes = {
    before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
    wrapper: `border-${
      theme.alpha
    } fixed bottom-0 w-full border-t transition-transform z-50 px-10 ${
      admin ? "h-[60px]" : "h-[90px]"
    }`,
    container: `flex flex-row gap-[10px] h-full items-stretch`,

    songInfoWrapper: `${admin ? 'w-1/4' : 'w-1/3 '}`,

    controlWrapper: `flex max-w-[400px] flex-grow`,
    controlWrapperChild_1: `${
      isOpenFullScreen
        ? "max-w-[600px] flex-col-reverse pb-[10px]"
        : "flex-col justify-center"
    }`,
    controlWrapperChild_2: `${!songInStore.song_url && "pointer-events-none opacity-60"}`,

    volumeWrapper: `volume-control ${admin ? 'w-1/4' : 'w-1/3 '} flex items-center justify-end gap-5`,
    volumeLineBase: `ml-3 w-full relative h-[4px] cursor-pointer rounded-3xl bg-gray-200`,
    volumeLineCurrent: `absolute left-0 top-0 h-full w-full rounded-l-full`,
  };

  return (
    <div
      className={`${classes.wrapper} ${isOpenFullScreen && "border-transparent"} ${
        inEdit && "translate-y-[100%] "
      } bg-transparent`}
    >
      <div
        className={`absolute inset-0 ${
          theme.bottom_player_bg
        } bg-opacity-[0.7] backdrop-blur-[15px] z-[-1] ${
          isOpenFullScreen ? "opacity-0 transition-opacity delay-[.2s]" : ""
        }`}
      ></div>
      <div
        className={`${classes.container} ${
          isOpenFullScreen ? "justify-center text-white" : "justify-between"
        } ${idle && "transition-opacity duration-[.3s] opacity-0"}`}
      >
        <div
          className={`${classes.songInfoWrapper}  ${isOpenFullScreen ? "hidden" : ""}`}
        >
          {/* song image, name and singer */}
          <div
            className={`flex flex-row items-center h-full origin-center ${
              isOpenFullScreen ? "hidden" : ""
            }`}
          >
            <div className="w-[2.5rem] h-[2.5rem]">
              <Image
                blurHashEncode={songInStore.blurhash_encode}
                src={songInStore.image_url || zingIcon}
                classNames="rounded-full"
              />
            </div>

            <div className="ml-[10px] flex-grow">
              <div className="h-[24px] w-full mask-image-horizontal">
                {useMemo(
                  () => (
                    <ScrollText
                      songInStore={songInStore}
                      autoScroll
                      classNames="text-[18px] font-[500]"
                      label={songInStore?.name || "name"}
                    />
                  ),
                  [songInStore]
                )}
              </div>

              <div className="h-[20px] w-full mask-image-horizontal">
                {useMemo(
                  () => (
                    <ScrollText
                      songInStore={songInStore}
                      autoScroll
                      classNames="text-[14px] opacity-60"
                      label={songInStore?.singer || "singer"}
                    />
                  ),
                  [songInStore]
                )}
              </div>
            </div>
          </div>
        </div>

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
            [playStatus.isPlaying, isOpenFullScreen, playStatus.isWaiting]
          )}
        </div>

        <div className={`${classes.volumeWrapper}  ${isOpenFullScreen ? "hidden" : ""}`}>
          <div className="flex flex-grow items-center max-w-[150px]">
            <button onClick={() => handleMute()}>
              {isMute ? (
                <SpeakerXMarkIcon className="w-6 h-6" />
              ) : (
                <SpeakerWaveIcon className="w-6 h-6" />
              )}
            </button>
            <div
              onClick={(e) => handleSetVolume(e)}
              ref={volumeLine}
              className={`${classes.volumeLineBase} ${classes.before}`}
            >
              <div
                ref={volumeProcessLine}
                className={`${classes.volumeLineCurrent} ${theme.content_bg}`}
              ></div>
            </div>
          </div>

          {!admin && (
            <>
              <Button
                onClick={handleOpenFullScreen}
                variant={"circle"}
                className={`h-[35px] w-[35px] rounded-[99px] ${theme.side_bar_bg}  ${
                  theme.content_hover_bg
                } p-[8px] ${songInStore.name ? "" : "opacity-20 pointer-events-none"}`}
              >
                <ChevronUpIcon />
              </Button>

              <Button
                onClick={() => setIsOpenSongQueue(!isOpenSongQueue)}
                className={`${
                  theme.content_hover_bg
                } h-[35px] w-[35px] p-[8px] rounded-[4px] ${
                  songInStore.name ? "" : "opacity-20 pointer-events-none"
                } ${isOpenSongQueue ? theme.content_bg : theme.side_bar_bg}`}
              >
                <QueueListIcon />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
