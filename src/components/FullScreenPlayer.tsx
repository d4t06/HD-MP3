import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lyric, Song } from "../types";

import { selectAllSongStore, setSong } from "../store/SongSlice";

import { useSongs } from "../store/SongsContext";
import { useTheme } from "../store/ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import LyricsList from "./LyricsList";
import Tabs from "./ui/Tabs";
import Button from "./ui/Button";
import SongThumbnail from "./ui/SongThumbnail";

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
  isPlaying,
}: Props) {
  const { songs } = useSongs();
  const { theme } = useTheme();

  const dispatch = useDispatch();
  const songStore = useSelector(selectAllSongStore);
  const { song: songInStore } = songStore;

  const [activeTab, setActiveTab] = useState<string>("Lyric");
  const [songLyric, setSongLyric] = useState<Lyric>({
    base: "",
    real_time: [],
  });

  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerIdForScroll = useRef<number>();
  const navigate = useNavigate();

  // handleEvent
  const handleSetSongWhenClick = (song: Song, index: number) => {

    if (songInStore.id === song.id) return;
    dispatch(setSong({ ...song, currentIndex: index }));
  };

  const handleClickToScroll = (direction: string) => {
    const containerEle = containerRef.current as HTMLElement;
    if (direction === "next") {
      //  scrollLelfRef.current += 500;
      containerEle.scrollLeft += 500;

      if (timerIdForScroll.current) {
        clearTimeout(timerIdForScroll.current);
      }
    } else if (direction === "previous") {
      //  scrollLelfRef.current -= 500;
      containerEle.scrollLeft -= 500;
    }
  };

  const handleEdit = () => {
    setIsOpenFullScreen(false);

    setTimeout(() => {
      navigate(`/React-Zingmp3/edit/${songInStore.id}`);
    }, 300);
  };

  //   only render when songs list change
  const renderSongsList = useMemo(() => {
    if (!songs?.length) return;
    return songs.map((song, index) => {
      const isActive = song.song_path === songInStore.song_path;

      return (
        <div key={index} className="px-[16px]">
          <SongThumbnail
          classNames="items-center justify-center"
            hasHover
            hasTitle
            containerEle={containerRef.current as HTMLElement}
            onClick={() => handleSetSongWhenClick(song, index)}
            active={isActive}
            data={song}
          />
        </div>
      );
    });
  }, [songInStore, songs]);

  //   only render when isPlaying, current song and lyric change
  const renderLyricTab = (
    <div className="lyric-container px-[40px] h-full w-full flex items-center justify-center flex-row">
      {/* left */}
      <div className="max-[549px]:hidden">
        <SongThumbnail classNames="items-center justify-center" active={isPlaying} data={songInStore} />
      </div>

      {/* right */}
      <div className="flex-1 max-w-[700px] ml-[50px] max-[549px]:ml-0 h-full overflow-auto no-scrollbar pb-[30%]">
        <LyricsList audioEle={audioEle} songLyric={songLyric} />
      </div>
    </div>
  );

  // update background image
  useEffect(() => {
    if (songInStore.image_path) {
      const node = bgRef.current as HTMLElement;
      node.style.backgroundImage = `url(${songInStore.image_path})`;
    }
  }, [songInStore]);

  useEffect(() => {
    if (!songInStore.lyric_id) return;

    console.log('check lyric_id', songInStore.lyric_id);
    

    const getLyric = async () => {
      const docRef = doc(db, "lyrics", songInStore.lyric_id);
      const docSnap = await getDoc(docRef);

      const lyricsData = docSnap.data() as Lyric;

      if (lyricsData) {
        setSongLyric(lyricsData);
      }
    };
    getLyric();

    return () => setSongLyric({base: '', real_time: []})
  }, [songInStore]);

  const style = {
    button: `p-[8px] bg-gray-500 bg-opacity-20 text-xl ${theme.content_hover_text}`,
  };


  // console.log("songInStore", songInStore.by, songInStore.by != 'admin');
  
  return (
    <div
      className={`fixed inset-0 z-50 bg-zinc-900  overflow-hidden text-white  ${
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

      <div className="h-[calc(100vh-90px)]">
        {/* header */}
        <div className="header-left flex px-10 py-[20px] relative h-[75px] max-[549px]:px-[10px]">
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
          <Tabs
            idle={idle}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={["Songs", "Lyric"]}
          />
          {/* right */}
          <div
            className={`flex items-center absolute right-10 gap-[10px] max-[549px]:right-[10px] top-0 h-full ${
              idle ? "hidden" : ""
            }`}
          >
            {songInStore.by != "admin" && (
              <Button
                onClick={() => handleEdit()}
                variant={"circle"}
                size={"normal"}
                className={style.button}
              >
                <DocumentTextIcon />
              </Button>
            )}

            <Button
              onClick={() => setIsOpenFullScreen(false)}
              variant={"circle"}
              size={"normal"}
              className={style.button}
            >
              <ChevronDownIcon />
            </Button>
          </div>
        </div>

        {/* content */}
        <div className=" h-[calc(100%-100px)] max-[549px]:h-[calc(100%-150px)] relative overflow-hidden">
          <div
            ref={containerRef}
            className={` ${
              activeTab !== "Songs" ? "opacity-0" : ""
            } relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth px-[500px] max-[549px]:px-[150px]`}
          >
            {containerRef && renderSongsList}

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

          {isOpenFullScreen && activeTab === "Lyric" && (
            <div className="absolute inset-0 z-20  ">{renderLyricTab}</div>
          )}
        </div>

        {isOpenFullScreen && activeTab === "Lyric" && (
          <p className="relative text-center text-white text-[14px] opacity-80">
            {songInStore.name} -{" "}
            <span className="opacity-30">{songInStore.singer}</span>
          </p>
        )}
      </div>
    </div>
  );
}
