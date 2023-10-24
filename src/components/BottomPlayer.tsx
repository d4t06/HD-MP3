import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { ChevronUpIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import Button from "./ui/Button";
import Control from "./Control";
import useVolume from "../hooks/useVolume";
import ScrollText from "./ScrollText";
import { Image } from ".";
import { useLocation } from "react-router-dom";

interface Props {
  isOpenFullScreen: boolean;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isPlaying: boolean;
  isWaiting: boolean;

  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
  setIsWaiting: Dispatch<React.SetStateAction<boolean>>;
}

export default function BottomPlayer({
  idle,
  audioEle,

  isOpenFullScreen,
  isPlaying,
  isWaiting,

  setIsWaiting,
  setIsPlaying,
  setIsOpenFullScreen,
}: Props) {
  const SongStore = useSelector(selectAllSongStore);

  const { song: songInStore } = SongStore;
  const { theme } = useTheme();

  // const [isMute, setIsMute] = useState(false);
  // const [volume, setVolume] = useLocalStorage("volume", 1);

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

  // update process lines width
  useEffect(() => {
    volumeLineWidth.current = volumeLine.current?.offsetWidth;
  }, [isOpenFullScreen]);

  const classes = {
    before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
    wrapper: `border-${theme.alpha} fixed bottom-0 w-full h-[90px] border-t transition-transform z-50 px-10`,
    container: `flex flex-row gap-[10px] h-full items-stretch`,

    controlWrapper: `flex max-w-[400px] flex-grow`,
    controlWrapperChild_1: `${isOpenFullScreen ? "max-w-[600px] flex-col-reverse pb-[10px]" : "flex-col justify-center"}`,
    controlWrapperChild_2: `${!songInStore.song_url && "pointer-events-none opacity-60"}`,

    volumeWrapper: `volume-control w-1/3 flex items-center justify-end gap-5`,
    volumeLineBase: `ml-3 w-full relative h-[4px] cursor-pointer rounded-3xl`,
    volumeLineCurrent: `absolute left-0 top-0 h-full w-full rounded-l-full`,
  };

  return (
    <div
      className={`${classes.wrapper} ${isOpenFullScreen ? "border-transparent" : ''} ${
        idle && 'hidden'} ${inEdit && "translate-y-[100%] "} bg-transparent`}
    >
      <div className={`absolute inset-0 ${theme.bottom_player_bg} bg-opacity-[0.7] backdrop-blur-[15px] z-[-1] ${isOpenFullScreen ? "opacity-0" : ''}`}></div>
      <div
        className={`${classes.container} ${ isOpenFullScreen ? "justify-center text-white" : "justify-between"}`}
      >
        <div className={`current-song w-1/3 ${isOpenFullScreen ? "hidden" : ""}`}>
          {/* song image, name and singer */}
          <div
            className={`flex flex-row items-center h-full origin-center ${
              isOpenFullScreen ? "hidden" : ""
            }`}
          >
            <div className="w-[2.5rem] h-[2.5rem]">
              <Image
                blurHashEncode={songInStore.blurhash_encode}
                src={songInStore.image_url}
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
          className={` ${classes.controlWrapper} ${classes.controlWrapperChild_1}  ${classes.controlWrapperChild_2}`}
        >
          {useMemo(
            () => (
              <Control
                audioEle={audioEle}
                idle={false}
                isPlaying={isPlaying}
                isWaiting={isWaiting}
                isOpenFullScreen={isOpenFullScreen}
                setIsWaiting={setIsWaiting}
                setIsPlaying={setIsPlaying}
              />
            ),
            [isPlaying, isOpenFullScreen, isWaiting]
          )}
        </div>

        <div className={`${classes.volumeWrapper}  ${isOpenFullScreen ? "hidden" : ""}`}>
          <div className="flex items-center w-[150px]">
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
              className={`${classes.volumeLineBase} ${
                theme.type === "light" ? "bg-gray-400" : "bg-gray-200"
              } ${classes.before}`}
            >
              <div
                ref={volumeProcessLine}
                className={`${classes.volumeLineCurrent} ${theme.content_bg}`}
              ></div>
            </div>
          </div>

          <Button
            onClick={() => setIsOpenFullScreen(true)}
            variant={"circle"}
            className={`h-[35px] w-[35px] p-[8px] ${
              songInStore.name ? "" : "opacity-20 pointer-events-none"
            }`}
          >
            <ChevronUpIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
