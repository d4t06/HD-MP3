import { Dispatch, SetStateAction, memo, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";
import { SongThumbnail, Tabs, LyricsList, Button } from ".";
import { useScrollSong } from "../hooks";
import useDebounce from "../hooks/useDebounced";
import FullScreenPlayerSetting from "./child/FullSreenPlayerSetting";
import { selectSongQueue, setCurrentQueueId } from "@/store/songQueueSlice";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "./MyPopup";
import MyTooltip from "./MyTooltip";
import { Blurhash } from "react-blurhash";
import { defaultBlurHash } from "@/constants/blurhash";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import Karaoke from "./Karaoke";
import LyricContextProvider from "@/store/LyricContext";

interface Props {
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  idle: boolean;
  audioEle: HTMLAudioElement;
  setIsPlaying?: () => void;
}
function FullScreenPlayer({
  isOpenFullScreen,
  setIsOpenFullScreen,
  idle,
  audioEle,
}: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  // const { currentSongData?.song } = useSelector(selectcurrentSongData?.song);
  const { queueSongs, currentQueueId, currentSongData } = useSelector(selectSongQueue);
  const { songBackground } = useSelector(selectAllPlayStatusStore);
  // state
  const [activeTab, setActiveTab] = useState<"Songs" | "Karaoke" | "Lyric">("Lyric");
  //  ref
  // const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSongRef = useRef<HTMLDivElement>(null);

  // use hooks
  const navigate = useNavigate();
  useScrollSong({
    containerRef,
    songItemRef: activeSongRef,
    isOpenFullScreen: isOpenFullScreen,
    idle,
  });

  // methods
  const handleClickNext = useDebounce(() => handleScroll("next"), 200);
  const handleClickPrevious = useDebounce(() => handleScroll("previous"), 200);

  const handleSetSongWhenClick = (queueId: string) => {
    if (currentQueueId === queueId) return;
    dispatch(setCurrentQueueId(queueId));
  };

  const handleScroll = (direction: string = "next") => {
    const containerEle = containerRef.current as HTMLElement;
    containerEle.style.scrollBehavior = "smooth";

    if (direction === "next") {
      containerEle.scrollLeft += 500;
    } else if (direction === "previous") {
      containerEle.scrollLeft -= 500;
    }
  };

  /** navigate to edit lyric page */
  const handleEdit = () => {
    if (!currentSongData?.song) return;
    setIsOpenFullScreen(false);

    setTimeout(() => {
      navigate(`/mysongs/edit/${currentSongData?.song.id}`);
    }, 300);
  };

  const classes = {
    button: `w-[44px] h-[44px] bg-white/10 rounded-[99px] hover:scale-[1.05] transition-transform ${theme.content_hover_bg}`,
    wrapper: `fixed inset-0 z-50 overflow-hidden text-white bg-zinc-900
    } transition-transform duration-[.7s] linear delay-100`,
    bg: `absolute inset-0 -z-10 brightness-[70%]`,
    container: "absolute w-full top-0 bottom-[90px] flex flex-col",
    headerWrapper: `relative flex py-[25px] px-[40px] w-full items-center`,
    content: `flex-grow relative overflow-hidden`,
    songsListTab: ` relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth px-[calc(50%-350px/2)]`,
    absoluteButton: `absolute top-[50%] -translate-y-[50%] p-[8px] bg-white/30 rounded-full ${theme.content_hover_bg}`,
    lyricTabContainer:
      "px-[40px] min-[1536px]:container  min-[1536px]:px-[200px] h-full flex items-center justify-center flex-row",
    fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
    logo: "animate-[spin_8s_linear_infinite] w-[46px] mr-1",
  };

  // define jsx
  const renderSongsList = useMemo(() => {
    if (!currentSongData?.song) return;
    if (!queueSongs.length) return;

    return queueSongs.map((song, index) => {
      const isActive = song.queue_id === currentQueueId;
      if (isActive) {
        return (
          <SongThumbnail
            key={index}
            ref={activeSongRef}
            classNames="active"
            hasTitle
            onClick={() => handleSetSongWhenClick(song.queue_id)}
            active={isActive}
            data={song}
          />
        );
      }

      return (
        <SongThumbnail
          key={index}
          idleClass={`${!isActive && idle ? classes.fadeTransition : ""}`}
          hasTitle
          active={isActive}
          data={song}
          onClick={() => handleSetSongWhenClick(song.queue_id)}
        />
      );
    });
  }, [currentSongData?.song, queueSongs, idle]);

  return (
    <div
      className={`${classes.wrapper}  ${
        isOpenFullScreen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* bg image */}
      <div className={` ${classes.bg}`}>
        {songBackground && (
          <Blurhash
            radioGroup=""
            height={"100%"}
            width={"100%"}
            hash={currentSongData?.song?.blurhash_encode || defaultBlurHash}
          />
        )}
      </div>

      <div className={classes.container}>
        {/* header */}
        <div className={classes.headerWrapper}>
          {/* left */}
          {idle && (
            <div className={`absolute flex left-4`}>
              {activeTab !== "Songs" && (
                <>
                  <p className={`font-playwriteCU text-sm`}>
                    {currentSongData?.song?.name || "..."}{" "}
                  </p>
                  <p className="opacity-70">
                    &nbsp;- {currentSongData?.song?.singer || "..."}
                  </p>
                </>
              )}
            </div>
          )}
          {/* tabs */}
          <Tabs
            inFullScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className={`${idle && classes.fadeTransition}`}
            tabs={["Songs", "Karaoke", "Lyric"]}
            render={(tab) => tab}
          />
          {/* right */}
          <div
            className={`absolute flex right-4 space-x-3 ${
              idle && classes.fadeTransition
            }`}
          >
            {currentSongData?.song?.by !== "admin" && activeTab === "Lyric" && (
              <MyTooltip position="top-[calc(100%+8px)]" content="Edit lyrics">
                <button onClick={() => handleEdit()} className={`p-3 ${classes.button}`}>
                  <DocumentTextIcon />
                </button>
              </MyTooltip>
            )}

            <MyPopup>
              <MyPopupTrigger>
                <MyTooltip position="top-[calc(100%+8px)]" content="Settings">
                  <button className={`${classes.button} p-3`}>
                    <Cog6ToothIcon />
                  </button>
                </MyTooltip>
              </MyPopupTrigger>
              <MyPopupContent
                appendTo="parent"
                className="top-[calc(100%+8px)] right-0 z-[99]"
                animationClassName="origin-top-right"
              >
                <FullScreenPlayerSetting />
              </MyPopupContent>
            </MyPopup>

            <MyTooltip position="top-[calc(100%+8px)]" content="Close">
              <button
                onClick={() => setIsOpenFullScreen(false)}
                className={`p-2 ${classes.button}`}
              >
                <ChevronDownIcon />
              </button>
            </MyTooltip>
          </div>
        </div>

        {/* content */}
        <div className={classes.content}>
          {/* song list */}
          <div
            ref={containerRef}
            className={`song-list-container ${classes.songsListTab} ${
              activeTab !== "Songs" ? "opacity-0" : "opacity-100"
            }`}
          >
            {renderSongsList}
          </div>
          {activeTab === "Songs" && !idle && (
            <>
              <Button
                hover={"scale"}
                size={"clear"}
                onClick={() => handleClickPrevious()}
                className={`${classes.absoluteButton} left-[20px]`}
              >
                <ChevronLeftIcon className="w-[30px]" />
              </Button>

              <Button
                hover={"scale"}
                size={"clear"}
                onClick={() => handleClickNext()}
                className={`${classes.absoluteButton} right-[20px]`}
              >
                <ChevronRightIcon className="w-[30px]" />
              </Button>
            </>
          )}

          {/* lyric tab */}
          <LyricContextProvider>
            <div
              className={`absolute inset-0 z-20 ${activeTab === "Lyric" ? "" : "hidden"}`}
            >
              {/* {renderLyricTab} */}
              <div className={classes.lyricTabContainer}>
                {/* left */}
                <SongThumbnail active={true} data={currentSongData?.song} />

                {/* right */}
                <LyricsList
                  className={`w-full ml-[40px] h-full`}
                  audioEle={audioEle}
                  active={isOpenFullScreen && activeTab === "Lyric"}
                />
              </div>
            </div>
            <div
              className={`absolute inset-0 z-20 flex flex-col items-center justify-center ${
                activeTab === "Karaoke" ? "" : "hidden"
              }`}
            >
              <Karaoke
                active={isOpenFullScreen && activeTab === "Karaoke"}
                audioEle={audioEle}
              />
            </div>
          </LyricContextProvider>
        </div>

        {activeTab !== "Songs" && (
          <p className={`text-center ${idle && classes.fadeTransition}`}>
            {currentSongData?.song?.name || "..."}
            <span className="opacity-70">
              &nbsp;- {currentSongData?.song?.singer || "..."}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(FullScreenPlayer);
