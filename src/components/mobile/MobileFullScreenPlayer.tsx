import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useMemo,
  MouseEvent,
  useEffect,
  ElementRef,
} from "react";

import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/store";

import { useBgImage } from "@/hooks";

import {
  Tabs,
  ScrollText,
  Control,
  LyricsList,
  MobileSongItem,
  MobileSongThumbnail,
  //   Modal,
  //   TimerModal,
} from "@/components";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import FullScreenPlayerSetting from "@/components/child/FullSreenPlayerSetting";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import useDisableOverflow from "@/hooks/useDisableOverflow";
import useMobileRotate from "@/hooks/useMobileRotate";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "../MyPopup";

type Props = {
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
};

// type Modal = "timer";

export default function MobileFullScreenPlayer({
  audioEle,
  isOpenFullScreen,
  setIsOpenFullScreen,
}: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { currentSong } = useSelector(selectCurrentSong);

  const {
    playStatus: { isPlaying },
  } = useSelector(selectAllPlayStatusStore);
  const { queueSongs } = useSelector(selectSongQueue);

  // state
  const [activeTab, setActiveTab] = useState<"Songs" | "Playing" | "Lyric">("Playing");
  const [scalingImage, _setScalingImage] = useState(false);
  //   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

  // ref
  const wrapperRef = useRef<ElementRef<"div">>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lyricContainerRef = useRef<HTMLDivElement>(null);

  // use hooks
  useDisableOverflow({ isOpenFullScreen });
  useBgImage({ bgRef, currentSong });
  const { isLandscape } = useMobileRotate();

  //   const closeModal = () => setIsOpenModal("");

  const findParent = (ele: HTMLDivElement) => {
    let i = 0;
    let parent = ele.parentElement as HTMLDivElement;
    while (!parent.classList.contains("target-class") && i < 5) {
      parent = parent.parentElement as HTMLDivElement;
      i++;
    }
    return parent;
  };

  const hideSongItemStyle = {
    opacity: "0",
    transform: "translate(-100%, 0)",
  };

  const hideSibling = (ele: HTMLDivElement) => {
    let i = 0;
    let node = ele.previousElementSibling as HTMLElement | null;
    while (node && i < 100) {
      Object.assign(node.style, hideSongItemStyle);
      i++;
      node = node.previousElementSibling as HTMLElement;
    }
  };

  const activeSong = (e: MouseEvent, song: Song, index: number) => {
    const ele = e.target as HTMLDivElement;

    const parent = findParent(ele);

    hideSibling(parent);
    Object.assign(parent.style, hideSongItemStyle);

    setTimeout(() => {
      dispatch(
        setSong({
          ...song,
          currentIndex: index,
          song_in: currentSong.song_in,
        })
      );
    }, 250);
  };

  const songsListItemTab = useMemo(() => {
    return (
      <>
        {currentSong && (
          <>
            {currentSong.currentIndex === queueSongs.length - 1 ? (
              <p>...</p>
            ) : (
              <>
                {queueSongs.map((song, index) => {
                  if (index > currentSong.currentIndex) {
                    return (
                      <MobileSongItem
                        variant="playing-next"
                        key={index}
                        theme={theme}
                        song={song}
                        onClick={(e) => activeSong(e, song, index)}
                      />
                    );
                  }
                })}
              </>
            )}
          </>
        )}
      </>
    );
  }, [currentSong, queueSongs]);

  useEffect(() => {
    const wrapperEle = wrapperRef.current;
    if (!wrapperEle) return;

    if (isOpenFullScreen) {
      wrapperEle.style.transform = "translate(0)";
      wrapperEle.style.zIndex = "99";
    } else {
      wrapperEle.style.transform = "translate(0, 100%)";
      setTimeout(() => {
        wrapperEle.style.zIndex = "-10";
      }, 500);
    }
  }, [isOpenFullScreen]);

  const classes = {
    headerWrapper: "h-[65px] p-4 flex ",

    // add padding to detect if container is overflow
    container: "flex-grow flex flex-col relative px-4 overflow-hidden",
    songImage: "flex-shrink-0 transition-[height, width] origin-top-left",
    nameAndSinger: "flex flex-grow justify-between items-center",
    control: "absolute bottom-0 left-4 right-4",
    lyricContainer: "absolute top-[65px] bottom-[120px] py-[16px] left-4 right-4",
    bgImage:
      "absolute inset-0 bg-no-repeat bg-cover bg-center blur-[50px] transition-[background-image] duration-[.3s ]",
    overlay:
      "absolute inset-0 bg-zinc-900 bg-opacity-60 bg-blend-multiply overflow-hidden",
    button: "inline-flex justify-center items-center rounded-full absolute w-[32px]",
  };

  return (
    <>
      <div
        ref={wrapperRef}
        style={{ transform: "translate(0, 100%)", zIndex: "-10" }}
        className={`fixed inset-0 bg-zinc-900 text-white overflow-hidden transition-[transform] duration-[.3s] ease-linear`}
      >
        <div ref={bgRef} className={classes.bgImage}></div>
        <div className={classes.overlay}></div>

        <div className="absolute inset-0 z-10 flex flex-col">
          <div className={classes.headerWrapper}>
            <MyPopup>
              <MyPopupTrigger>
                <button
                  className={`${classes.button} p-[6px] left-0 bg-gray-500 bg-opacity-20`}
                >
                  <Cog6ToothIcon className="w-[20px]" />
                </button>
              </MyPopupTrigger>

              <MyPopupContent
                className="top-[calc(100%+8px)] left-0 z-[99]"
                animationClassName="origin-top-left"
              >
                <FullScreenPlayerSetting audioEle={audioEle} />
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
              className={`${classes.button} p-[6px] right-4 bg-gray-500 bg-opacity-20`}
              onClick={() => setIsOpenFullScreen(false)}
            >
              <ChevronDownIcon className="w-[20px]" />
            </button>
          </div>

          {/* container */}
          <div ref={containerRef} className={classes.container}>
            {/* song info */}
            <div
              className={`${
                (activeTab != "Playing" && !scalingImage) || isLandscape ? "flex" : ""
              }`}
            >
              {useMemo(
                () => (
                  <MobileSongThumbnail
                    active={activeTab === "Playing" && !isLandscape}
                    data={currentSong}
                  />
                ),
                [currentSong, isPlaying, activeTab, isLandscape]
              )}

              {/* name and singer */}
              <div
                className={`${classes.nameAndSinger} ${
                  activeTab != "Playing" || isLandscape
                    ? "ml-[10px]"
                    : "mt-[15px] min-[549px]:mt-0"
                }`}
              >
                <div className="group flex-grow overflow-hidden">
                  <div className={"h-[34px]"}>
                    <ScrollText
                      autoScroll
                      className={`${
                        activeTab === "Playing" || isLandscape ? "text-lg" : "text-base"
                      } leading-[1.5] font-playwriteCU`}
                      content={currentSong.name || "..."}
                    />
                  </div>
                  <div className={"h-[33px]"}>
                    <ScrollText
                      autoScroll
                      className={`opacity-60 ${
                        activeTab === "Playing" || isLandscape ? "text-lg" : "text-base"
                      }`}
                      content={currentSong.singer || "..."}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* lyric tab */}
            <div
              ref={lyricContainerRef}
              className={`${classes.lyricContainer} ${
                activeTab === "Lyric" ? "block" : "hidden"
              }`}
            >
              {useMemo(
                () => (
                  <LyricsList
                    active={activeTab === "Lyric"}
                    className="h-[100%]"
                    audioEle={audioEle}
                    isOpenFullScreen={isOpenFullScreen && activeTab === "Lyric"}
                  />
                ),
                [isOpenFullScreen, activeTab, isLandscape]
              )}
            </div>

            {/* song list tab */}
            <div
              className={`${
                activeTab === "Songs"
                  ? "flex-grow flex flex-col overflow-hidden"
                  : "hidden"
              }`}
            >
              <div className="leading-[2.2] font-playwriteCU mb-2 mt-1">Playing next</div>
              <div className="flex-grow pb-[30px] no-scrollbar overflow-auto">
                {songsListItemTab}
              </div>
            </div>

            {/* control */}
            <div
              className={`${classes.control} ${
                activeTab === "Songs" && "opacity-0 pointer-events-none h-[0px] mb-[0px]"
              }`}
            >
              <div className="h-[120px]">
                {useMemo(
                  () => (
                    <Control audioEle={audioEle} isOpenFullScreen={true} idle={false} />
                  ),
                  [isOpenFullScreen]
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
