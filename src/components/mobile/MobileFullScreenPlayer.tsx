import { useRef, useState } from "react";
import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Tabs, Control, MobileSongThumbnail, LyricsList, ScrollText } from "@/components";
import FullScreenPlayerSetting from "@/components/child/FullSreenPlayerSetting";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "../MyPopup";
import SleepTimerButton from "../SleepTimerButton";
import MobileFullScreenSongList from "./MobileFullScreenSongList";
import useMobileFullScreenPlayer from "./useMobileFullScreenPlayer";
import { Blurhash } from "react-blurhash";
import { defaultBlurHash } from "@/constants/blurhash";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import LyricContextProvider from "@/store/LyricContext";
import { usePlayerContext } from "@/store";

export default function MobileFullScreenPlayer() {
  // use store
  const { controlRef, setIsOpenFullScreen, isOpenFullScreen } = usePlayerContext();
  const { currentSongData } = useSelector(selectSongQueue);
  const { songBackground } = useSelector(selectAllPlayStatusStore);

  // state
  const [activeTab, setActiveTab] = useState<"Songs" | "Playing" | "Lyric">("Playing");
  // const [scalingImage, _setScalingImage] = useState(false);

  // ref
  const containerRef = useRef<HTMLDivElement>(null);

  // use hooks
  const { wrapperRef } = useMobileFullScreenPlayer({ isOpenFullScreen });

  const classes = {
    headerWrapper: "flex mb-4",
    container: "flex-grow flex flex-col relative overflow-hidden",
    control: "flex flex-col-reverse justify-center",

    bgImage: "absolute inset-0 z-[-9] brightness-[70%] blur-[4px] translate-3d-0",
    button: "flex justify-center items-center rounded-full w-[38px]",
  };

  return (
    <>
      <div
        ref={wrapperRef}
        style={{ transform: "translate(0, 100%)", zIndex: "-10" }}
        className={`fixed inset-0 bg-zinc-900 text-white overflow-hidden transition-[transform] duration-[.3s] ease-linear`}
      >
        {songBackground && (
          <div className={classes.bgImage}>
            <Blurhash
              width={"100%"}
              height={"100%"}
              hash={currentSongData?.song.blurhash_encode || defaultBlurHash}
            />
          </div>
        )}

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
            {/* >>> song image */}
            <div className={`${activeTab != "Playing" ? "flex" : "sm:flex"}`}>
              <MobileSongThumbnail
                expand={activeTab === "Playing"}
                imageUrl={currentSongData?.song.image_url}
              />

              <div
                className={`ml-2 ${activeTab != "Playing" ? "block" : "hidden sm:block"}`}
              >
                <p className="font-playwriteCU translate-y-[-6px] leading-[2.4] line-clamp-1">
                  {currentSongData?.song.name}
                </p>
                <div className="opacity-70 translate-y-[-4px] leading-[1] line-clamp-1">
                  {currentSongData?.song.singer}
                </div>
              </div>
            </div>

            {/* <<< end song image */}

            {/* >>> song name */}
            <div
              className={`mt-5 justify-between items-center ${
                activeTab != "Playing" ? "hidden" : "flex sm:hidden"
              }`}
            >
              <div className="flex-grow">
                <div className={"h-[40px]"}>
                  <ScrollText
                    autoScroll
                    className={`text-xl leading-[1.5] font-playwriteCU`}
                    content={currentSongData?.song.name || "..."}
                  />
                </div>
                <div className={"h-[28px]"}>
                  <ScrollText
                    autoScroll
                    className={`opacity-60 ${
                      activeTab === "Playing" ? "text-lg" : "text-base"
                    }`}
                    content={currentSongData?.song.singer || "..."}
                  />
                </div>
              </div>

              <SleepTimerButton />
            </div>
            {/* <<< end song name */}

            <LyricContextProvider>
              {/* >>> lyric tab */}
              <LyricsList
                active={isOpenFullScreen && activeTab === "Lyric"}
                className={`text-center ${
                  activeTab === "Lyric" ? "flex-1 block" : "hidden"
                }`}
              />
              {/* <<< end lyric tab */}
            </LyricContextProvider>

            {/* >>> song list tab */}
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
              {currentSongData && (
                <MobileFullScreenSongList currentIndex={currentSongData.index} />
              )}
            </div>
            {/* <<< end song list tab */}

            {/* control */}
            <div
              className={`${classes.control} ${
                activeTab === "Songs" ? "opacity-0 pointer-events-none h-[0px]" : ""
              } ${activeTab === "Playing" ? "flex-grow" : ""}`}
            >
              <Control variant="mobile" ref={controlRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
