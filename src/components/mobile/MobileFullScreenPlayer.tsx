import { Dispatch, SetStateAction, useRef, useState } from "react";
import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useBgImage } from "@/hooks";

import { Tabs, Control, MobileSongThumbnail, LyricsList, ScrollText } from "@/components";
import FullScreenPlayerSetting from "@/components/child/FullSreenPlayerSetting";
import { selectCurrentSong } from "@/store/currentSongSlice";
import useDisableOverflow from "@/hooks/useDisableOverflow";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "../MyPopup";
import SleepTimerButton from "../SleepTimerButton";
import MobileFullScreenSongList from "./MobileFullScreenSongList";
import useMobileFullScreenPlayer from "./useMobileFullScreenPlayer";

type Props = {
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
};

export default function MobileFullScreenPlayer({
  audioEle,
  isOpenFullScreen,
  setIsOpenFullScreen,
}: Props) {
  // use store
  const { currentSong } = useSelector(selectCurrentSong);

  // state
  const [activeTab, setActiveTab] = useState<"Songs" | "Playing" | "Lyric">("Playing");
  const [scalingImage, _setScalingImage] = useState(false);

  // ref
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // use hooks
  useDisableOverflow({ isOpenFullScreen });
  useBgImage({ bgRef, currentSong });
  const { wrapperRef } = useMobileFullScreenPlayer({ isOpenFullScreen });

  const isLandscape = false;
  const notPlayingOrLandscape = (activeTab != "Playing" && !scalingImage) || isLandscape;

  const classes = {
    headerWrapper: "flex mb-4",
    container: "flex-grow flex flex-col relative overflow-hidden",
    control: "flex flex-col-reverse justify-center",
    bgImage:
      "absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat brightness-[60%] blur-[50px] translate-3d-0",
    button: "flex justify-center items-center rounded-full w-[38px]",
  };

  return (
    <>
      <div
        ref={wrapperRef}
        style={{ transform: "translate(0, 100%)", zIndex: "-10" }}
        className={`fixed inset-0 bg-zinc-900 text-white overflow-hidden transition-[transform] duration-[.3s] ease-linear`}
      >
        <div ref={bgRef} className={classes.bgImage}></div>

        <div className="h-full z-10 p-4 flex flex-col">
          <div className={classes.headerWrapper}>
            <MyPopup appendOnPortal>
              <MyPopupTrigger>
                <button
                  className={`${classes.button} p-[6px] left-0 bg-gray-500 bg-opacity-20`}
                >
                  <Cog6ToothIcon className="w-full" />
                </button>
              </MyPopupTrigger>

              <MyPopupContent appendTo="portal" position="right-bottom" origin="top left">
                <FullScreenPlayerSetting />
              </MyPopupContent>
            </MyPopup>

            <Tabs
              inFullScreen
              className="w-fit font-[500]"
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              render={(tab) => tab}
              tabs={["Songs", "Playing", "Lyric"]}
            />

            <button
              className={`${classes.button} p-[6px] bg-gray-500 bg-opacity-20`}
              onClick={() => setIsOpenFullScreen(false)}
            >
              <ChevronDownIcon className="w-full" />
            </button>
          </div>

          {/* container */}
          <div ref={containerRef} className={classes.container}>
            {/* song info */}
            <div className={`${notPlayingOrLandscape ? "flex " : ""}`}>
              <MobileSongThumbnail
                expand={activeTab === "Playing" && !isLandscape}
                data={currentSong}
              />

              <div className={`ml-2 ${notPlayingOrLandscape ? "block" : "hidden"}`}>
                <div className="h-[30px]">
                  <p className="font-playwriteCU leading-[1.5]">{currentSong?.name}</p>
                </div>
                <div className="opacity-70">{currentSong?.singer}</div>
              </div>
            </div>

            {/* song name */}
            <div
              className={`mt-5 justify-between items-center ${
                activeTab != "Playing" ? "hidden" : "flex"
              }`}
            >
              <div className="flex-grow">
                <div className={"h-[40px]"}>
                  <ScrollText
                    autoScroll
                    className={`text-xl leading-[1.5] font-playwriteCU`}
                    content={currentSong?.name || "..."}
                  />
                </div>
                <div className={"h-[33px]"}>
                  <ScrollText
                    autoScroll
                    className={`opacity-60 ${
                      activeTab === "Playing" || isLandscape ? "text-lg" : "text-base"
                    }`}
                    content={currentSong?.singer || "..."}
                  />
                </div>
              </div>

              <SleepTimerButton audioEle={audioEle} />
            </div>

            {/* lyric tab */}
            <LyricsList
              active={activeTab === "Lyric"}
              className={`${
                activeTab === "Lyric" ? "flex-1 transition-all block" : "hidden"
              }`}
              audioEle={audioEle}
              isOpenFullScreen={isOpenFullScreen && activeTab === "Lyric"}
            />

            {/* song list tab */}
            <div
              className={`leading-[2.2] font-playwriteCU my-2 ${
                activeTab === "Songs" ? "" : "hidden"
              }`}
            >
              Playing next
            </div>

            <div
              className={`flex-grow no-scrollbar overflow-auto ${
                activeTab === "Songs" ? "" : "hidden"
              }`}
            >
              {currentSong && (
                <MobileFullScreenSongList currentIndex={currentSong.currentIndex} />
              )}
            </div>

            {/* control */}
            <div
              className={`${classes.control} ${
                activeTab === "Songs" ? "opacity-0 pointer-events-none h-[0px]" : ""
              } ${activeTab === "Playing" ? "flex-grow" : ""}`}
            >
              <Control audioEle={audioEle} isOpenFullScreen={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
