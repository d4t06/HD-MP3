import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  // useMemo,
  // MouseEvent,
  useEffect,
  ElementRef,
} from "react";

import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import {  useSelector } from "react-redux";
// import { useTheme } from "@/store";

import { useBgImage } from "@/hooks";

import {
  Tabs,
  // ScrollText,
  Control,
  // LyricsList,
  // MobileSongItem,
  MobileSongThumbnail,
} from "@/components";
import FullScreenPlayerSetting from "@/components/child/FullSreenPlayerSetting";
import { selectCurrentSong } from "@/store/currentSongSlice";
// import { selectSongQueue } from "@/store/songQueueSlice";
import useDisableOverflow from "@/hooks/useDisableOverflow";
// import useMobileRotate from "@/hooks/useMobileRotate";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "../MyPopup";
// import SleepTimerButton from "../SleepTimerButton";

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
  // const dispatch = useDispatch();
  // const { theme } = useTheme();
  const { currentSong } = useSelector(selectCurrentSong);
  // const { queueSongs } = useSelector(selectSongQueue);

  // state
  const [activeTab, setActiveTab] = useState<"Songs" | "Playing" | "Lyric">("Playing");
  const [scalingImage, _setScalingImage] = useState(false);

  // ref
  const wrapperRef = useRef<ElementRef<"div">>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSongRef = useRef<ElementRef<"div">>(null);

  // use hooks
  useDisableOverflow({ isOpenFullScreen });
  useBgImage({ bgRef, currentSong });
  // const { isLandscape } = useMobileRotate();

  const isLandscape = false;

  //   const closeModal = () => setIsOpenModal("");

  const notPlayingOrLandscape = (activeTab != "Playing" && !scalingImage) || isLandscape;

  // const findParent = (ele: HTMLDivElement) => {
  //   let i = 0;
  //   let parent = ele;
  //   while (!parent.classList.contains("target-class") && i < 5) {
  //     parent = parent.parentElement as HTMLDivElement;
  //     i++;
  //   }
  //   return parent;
  // };

  // const hideSongItemStyle = {
  //   opacity: "0",
  //   transform: "translate(-100%, 0)",
  // };

  // const hideSibling = (ele: HTMLDivElement) => {
  //   let i = 0;
  //   let node = ele.previousElementSibling as HTMLElement | null;
  //   while (node && i < 100) {
  //     Object.assign(node.style, hideSongItemStyle);
  //     i++;
  //     node = node.previousElementSibling as HTMLElement;
  //   }
  // };

  // const activeSong = (e: MouseEvent, song: Song, index: number) => {
  //   if (!currentSong) return;

  //   const ele = e.target as HTMLDivElement;

  //   const parent = findParent(ele);
  //   // hideSibling(parent);
  //   Object.assign(parent.style, hideSongItemStyle);

  //   if (currentSongRef.current) {
  //     currentSongRef.current.style.opacity = "0";
  //   }

  //   setTimeout(() => {
  //     dispatch(
  //       setSong({
  //         ...song,
  //         currentIndex: index,
  //         song_in: currentSong.song_in,
  //       })
  //     );
  //   }, 500);
  // };

  // const songsListItemTab = useMemo(
  //   () => (
  //     <>
  //       {currentSong && (
  //         <>
  //           {currentSong.currentIndex === queueSongs.length - 1 ? (
  //             <p>...</p>
  //           ) : (
  //             queueSongs.map((song, index) => {
  //               if (index > currentSong.currentIndex)
  //                 return (
  //                   <MobileSongItem
  //                     variant="playing-next"
  //                     key={index}
  //                     theme={theme}
  //                     song={song}
  //                     onClick={(e) => activeSong(e, song, index)}
  //                   />
  //                 );
  //             })
  //           )}
  //         </>
  //       )}
  //     </>
  //   ),
  //   [currentSong, queueSongs]
  // );

  useEffect(() => {
    if (currentSongRef.current) {
      currentSongRef.current.style.opacity = "1";
    }
  }, [currentSong]);

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
    headerWrapper: "flex mb-4",
    container: "flex-grow flex flex-col relative overflow-hidden",
    songImage: "flex-shrink-0 transition-[height, width] origin-top-left",
    control: "flex flex-col-reverse justify-center",
    bgImage:
      "absolute inset-0 bg-no-repeat bg-cover bg-center blur-[50px] transition-[background-image] duration-[.3s ]",
    overlay:
      "absolute inset-0 bg-zinc-900 bg-opacity-60 bg-blend-multiply overflow-hidden",
    button: "flex justify-center items-center rounded-full w-[38px]",
  };


  console.log('MobileFullScreenPlayer render');

  // return <></>
  

  return (
    <>
      <div
        ref={wrapperRef}
        style={{ transform: "translate(0, 100%)", zIndex: "-10" }}
        className={`fixed inset-0 bg-zinc-900 text-white overflow-hidden transition-[transform] duration-[.3s] ease-linear`}
      >
        <div ref={bgRef} className={classes.bgImage}></div>
        <div className={classes.overlay}></div>

        <div className="absolute inset-0 z-10 p-4 flex flex-col">
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
            <div
              ref={currentSongRef}
              className={`transition-opacity duration-300 ${
                notPlayingOrLandscape ? "flex " : ""
              }`}
            >
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

            {/* <div
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
            </div> */}
            {/* </div> */}

            {/* lyric tab */}

            {/* <LyricsList
              active={activeTab === "Lyric"}
              className={`${
                activeTab === "Lyric" ? "flex-1 transition-all block" : "hidden"
              }`}
              audioEle={audioEle}
              isOpenFullScreen={isOpenFullScreen && activeTab === "Lyric"}
            /> */}

            {/* song list tab */}
            {/* <div
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
              {songsListItemTab}
            </div> */}

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
