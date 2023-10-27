import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Song } from "../types";
import { selectAllSongStore, setSong, useTheme, useActuallySongs } from "../store";
import { SongThumbnail, Button, Tabs, LyricsList } from ".";
import { useScrollSong, useBgImage, useGetSongLyric } from "../hooks";
import useDebounce from "../hooks/useDebounced";

interface Props {
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isPlaying: boolean;
  setIsPlaying?: () => void;
}

export default function FullScreenPlayer({
  isOpenFullScreen,
  setIsOpenFullScreen,
  idle,
  audioEle,
}: Props) {
  // define store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { song: songInStore } = useSelector(selectAllSongStore);
  const { actuallySongs } = useActuallySongs();

  // component state
  const [activeTab, setActiveTab] = useState<string>("Lyric");

  // component ref
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSongRef = useRef<HTMLDivElement>(null);
  const firstTimeRender = useRef(true);

  // use hooks
  const navigate = useNavigate();
  const songLyric = useGetSongLyric({ songInStore, audioEle });
  useBgImage({ bgRef, songInStore });
  useScrollSong({
    containerRef,
    songItemRef: activeSongRef,
    firstTimeRender,
    isOpenFullScreen: isOpenFullScreen,
  });

  // define callback functions
  const handleSetSongWhenClick = (song: Song, index: number) => {
    if (songInStore.id === song.id) return;
    dispatch(setSong({ ...song, currentIndex: index, song_in: songInStore.song_in }));
  };

  //   const checkIsScrollFinish = () => {
  //     const containerEle = containerRef.current as HTMLElement;
  //     const diff = scrollLeft.current - Math.ceil(containerEle.scrollLeft);
  //     console.log(">>> chekc scroll", diff, containerEle.scrollLeft, scrollLeft.current);

  //     return !(Math.abs(diff) > 1);
  //   };

  const handleClickNext = useDebounce(() => handleScroll("next"), 250);
  const handleClickPrevious = useDebounce(() => handleScroll("previous"), 250);

  const handleScroll = (direction: string = "next") => {
    const containerEle = containerRef.current as HTMLElement;

    if (direction === "next") {
      containerEle.scrollLeft += 500;
    } else if (direction === "previous") {
      containerEle.scrollLeft -= 500;
    }
  };

  const handleEdit = () => {
    setIsOpenFullScreen(false);

    setTimeout(() => {
      navigate(`/React-Zingmp3/mysongs/edit/${songInStore.id}`);
    }, 300);
  };

  const classes = {
    button: `p-[8px] bg-gray-500 bg-opacity-20 text-xl ${theme.content_hover_text}`,
    mainContainer: `fixed inset-0 bg-zinc-900 bottom-[0]  overflow-hidden text-white  ${
      isOpenFullScreen ? "translate-y-0" : "translate-y-full"
    } transition-[transform] duration-[.4s] linear delay-100`,
    bg: `absolute h-[100vh] w-[100vw] -z-10 inset-0 bg-no-repeat bg-cover bg-center blur-[50px] transition-[background] duration-100`,
    overplay: `absolute h-[100vh] w-[100vw] inset-0 bg-zinc-900 bg-opacity-80 bg-blend-multiply`,
    header: `header-left flex px-10 py-[20px] relative h-[75px]`,
    headerRight: `flex items-center absolute right-10 gap-[10px] top-0 h-full ${
      idle ? "hidden" : ""
    }`,

    contentContainer: `h-[calc(100%-100px)] relative overflow-hidden`,
    songsListTab: `${
      activeTab !== "Songs" ? "opacity-0" : ""
    } relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth px-[calc(50%-390px/2)]`,

    absoluteButton: `absolute top-[50%] -translate-y-[50%] p-[8px] bg-[#fff] bg-opacity-[.2] hover:opacity-100 rounded-full ${theme.content_hover_text}`,
    songNameSinger: "relative text-center text-white text-[14px] opacity-80",
    lyricTabContainer:
      "px-[40px] h-full w-full flex items-center justify-center flex-row",
    lyricContainer: "flex-grow ml-[50px] h-full overflow-hidden",
  };

  // define jsx
  const renderSongsList = useMemo(() => {
    if (!actuallySongs.length) return;

    return actuallySongs.map((song, index) => {
      const isActive = index === songInStore.currentIndex;
      if (isActive) {
        return (
          <SongThumbnail
            theme={theme}
            key={index}
            ref={activeSongRef}
            classNames="items-end justify-center flex-shrink-0 w-[350px] h-[350px]"
            hasHover
            hasTitle
            onClick={() => handleSetSongWhenClick(song, index)}
            active={isActive}
            data={song}
          />
        );
      }

      return (
        <SongThumbnail
          theme={theme}
          key={index}
          classNames="items-end justify-center flex-shrink-0 w-[350px] h-[350px]"
          hasHover
          hasTitle
          onClick={() => handleSetSongWhenClick(song, index)}
          active={isActive}
          data={song}
        />
      );
    });
  }, [songInStore, actuallySongs]);

  const renderLyricTab = (
    <div className={classes.lyricTabContainer}>
      {/* left */}

      <SongThumbnail theme={theme} active={true} data={songInStore} />

      {/* right */}
      <div className={classes.lyricContainer}>
        <LyricsList audioEle={audioEle} songLyric={songLyric} />
      </div>
    </div>
  );

  return (
    <div className={`${classes.mainContainer}`}>
      {/* bg image */}
      <div ref={bgRef} className={classes.bg}></div>
      <div className={classes.overplay}></div>

      <div className="h-[calc(100vh-90px)]">
        {/* header */}
        <div className={classes.header}>
          {/* left */}
          <div className={`relative h-full ${idle ? "" : "hidden"}`}>
            <div className={`absolute left-0 top-0 h-full `}>
              {/* <img
                        className="h-full"
                        src="https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                        alt=""
                     /> */}
            </div>
          </div>
          {/* tabs */}
          <Tabs
            idle={idle}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={["Songs", "Lyric"]}
          />
          {/* right */}
          <div className={`${classes.headerRight}`}>
            {songInStore.by != "admin" && activeTab === "Lyric" && (
              <Button
                onClick={() => handleEdit()}
                variant={"circle"}
                size={"normal"}
                className={classes.button}
              >
                <DocumentTextIcon />
              </Button>
            )}

            <Button
              onClick={() => setIsOpenFullScreen(false)}
              variant={"circle"}
              size={"normal"}
              className={classes.button}
            >
              <ChevronDownIcon />
            </Button>
          </div>
        </div>

        {/* content */}
        <div className={classes.contentContainer}>
          <div
            ref={containerRef}
            className={` ${classes.songsListTab}`}
          >
            {renderSongsList}
          </div>
          {activeTab === "Songs" && (
            <>
              <button
                onClick={() => handleClickPrevious()}
                className={`${classes.absoluteButton} left-[20px]`}
              >
                <ChevronLeftIcon className="w-[25px]" />
              </button>

              <button
                onClick={() => handleClickNext()}
                className={`${classes.absoluteButton} right-[20px]`}
              >
                <ChevronRightIcon className="w-[25px]" />
              </button>
            </>
          )}

          {isOpenFullScreen && activeTab === "Lyric" && (
            <div className="absolute inset-0 z-20  ">{renderLyricTab}</div>
          )}
        </div>

        {isOpenFullScreen && activeTab === "Lyric" && (
          <p className={classes.songNameSinger}>
            {songInStore.name} - <span className="opacity-30">{songInStore.singer}</span>
          </p>
        )}
      </div>
    </div>
  );
}
