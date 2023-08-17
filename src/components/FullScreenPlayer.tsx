import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "./ui/Button";
import { songs } from "../utils/songs";
import SongThumbnail from "./ui/SongThumbnail";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { Song } from "../types";
import LyricsList from "./LyricsList";
import { lyricsStore } from "../lyric";
import { generateSlug } from "../utils/generateSlug";
import Tabs from "./ui/Tabs";

interface Props {
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
  idle: boolean;
  audioEle: HTMLAudioElement;
  isPlaying: boolean;
  setIsPlaying?: () => void;
}

const FullScreenPlayer: FC<Props> = ({
  isOpenFullScreen,
  setIsOpenFullScreen,
  idle,
  audioEle,
  isPlaying,
}) => {
  const dispatch = useDispatch();
  const songStore = useSelector(selectAllSongStore);

  const { song: songInStore } = songStore;
  const slug = generateSlug(songInStore.name) as keyof typeof lyricsStore;

  const songWithLyric = {
    ...songInStore,
    lyrics: lyricsStore[slug],
  };

  const [activeTab, setActiveTab] = useState<string>("lyric");

  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // handleEvent
  const handleSetSongWhenClick = (song: Song, index: number) => {
    dispatch(setSong({ ...song, currentIndex: index }));
  };

  const handleClickToScroll = (direction: string) => {
    const containerEle = containerRef.current as HTMLElement;
    if (direction === "next") {
      containerEle.scrollLeft = containerEle.scrollLeft + 500;
    } else if (direction === "previous") {
      containerEle.scrollLeft = containerEle.scrollLeft - 500;
    }
  };

  // update background image
  useEffect(() => {
    if (songInStore.image) {
      const node = bgRef.current as HTMLElement;
      node.style.backgroundImage = `url(${songInStore.image})`;
    }
  }, [songInStore]);

  //   only render when songs list change
  const renderSongThumbnail = useMemo(() => {
    return songs.map((song, index) => {
      const isActive = song.path === songInStore.path;

      return (
        <div key={index} className="px-[16px]">
          <SongThumbnail
            hasHover
            containerEle={containerRef.current as HTMLElement}
            onClick={() => handleSetSongWhenClick(song, index)}
            active={isActive}
            data={song}
          />
        </div>
      );
    });
  }, [songInStore]);

  //   only render when isPlaying, current song change
  const renderLyricTab = useMemo(() => {
    return (
      <div className="lyric-container px-[40px] h-full w-full flex items-center justify-center flex-row">
        {/* left */}
        <div className="max-[549px]:hidden">
          <SongThumbnail active={isPlaying} data={songInStore} />
        </div>

        {/* right */}
        <div className="flex-1 max-w-[700px] ml-[50px] max-[549px]:ml-0 h-full overflow-auto no-scrollbar pb-[30%]">
          {songWithLyric.lyrics ? (
            <LyricsList audioEle={audioEle} lyrics={songWithLyric.lyrics} />
          ) : (
            <h1 className="text-[40px] text-center">...</h1>
          )}
        </div>
      </div>
    );
  }, [isPlaying, songInStore]);

  // console.log("check idle", idle);

  return (
    <div
      className={`fixed inset-0 z-50 bg-zinc-900 text-white overflow-hidden  ${
        isOpenFullScreen ? "translate-y-0" : "translate-y-full"
      } transition-[transform] duration-300 ease-in-out delay-150  `}
    >
      {/* bg image */}
      <div
        ref={bgRef}
        className={`absolute h-[100vh] w-[100vw] -z-10 inset-0 bg-no-repeat bg-cover bg-center blur-[99px] transition-[background] duration-100`}
      ></div>
      <div
        className={`absolute h-[100vh] w-[100vw] inset-0 bg-zinc-900 bg-opacity-80 bg-blend-multiply`}
      ></div>

      <div className="header h-[calc(100vh-90px)]">
        <div className="header-left px-10 py-[20px] relative h-[75px] max-[549px]:px-[10px]">
          {/* left */}
          <div className={`relative h-full ${idle ? "" : "hidden"}`}>
            <div className={`absolute left-0 top-0 h-full `}>
              <img
                className="h-full"
                src="https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                alt=""
              />
            </div>
          </div>
          {/* tabs */}
          <Tabs idle={idle} activeTab={activeTab} setActiveTab={setActiveTab} tabs={['Songs list', 'Lyric']}/>
          {/* right */}
          <div
            className={`flex items-center absolute right-10 max-[549px]:right-[10px] top-0 h-full ${
              idle ? "hidden" : ""
            }`}
          >
            <Button
              onClick={() => setIsOpenFullScreen(false)}
              variant={"circle"}
              size={"normal"}
              className="p-[8px] bg-gray-500 bg-opacity-20 text-xl"
            >
              <ChevronDownIcon />
            </Button>
          </div>
        </div>

        {/* content */}
        <div className="container h-[calc(100%-75px)] max-[549px]:h-[calc(100%-150px)] relative overflow-auto">
          <div
            ref={containerRef}
            className={` ${
              activeTab !== "Songs list" ? "opacity-0" : ""
            } relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth px-[500px] max-[549px]:px-[150px]`}
          >
            {containerRef && renderSongThumbnail}

            <Button
              onClick={() => handleClickToScroll("previous")}
              variant={"circle"}
              size={"large"}
              className="p-[8px] bg-gray-500 bg-opacity-50 text-xl fixed top-1/2 -translate-y-1/2 left-[20px] max-[549px]:hidden"
            >
              <ChevronLeftIcon />
            </Button>

            <Button
              onClick={() => handleClickToScroll("next")}
              variant={"circle"}
              size={"large"}
              className="p-[8px] bg-gray-500 bg-opacity-50 text-xl fixed top-1/2 -translate-y-1/2 right-[20px] max-[549px]:hidden"
            >
              <ChevronRightIcon />
            </Button>
          </div>

          {activeTab === "Lyric" && (
            <div className="absolute inset-0 z-20  ">{renderLyricTab}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;
