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

import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import LyricsList from "./LyricsList";
import Tabs from "./Tabs";
import Button from "./ui/Button";
import SongThumbnail from "./SongThumbnail";
import useBgImage from "../hooks/useBgImage";
import useSongLyric from "../hooks/useGetSongLyric";
import { useSongsStore } from "../store/SongsContext";
import { useActuallySongs } from "../store/ActuallySongsContext";

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
   // define store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const {songLists} = useActuallySongs()

   // component state
   const [activeTab, setActiveTab] = useState<string>("Lyric");

   // component ref
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const timerIdForScroll = useRef<number>();
   const navigate = useNavigate();

   // use hooks
   useBgImage({ bgRef, songInStore });

   const songLyric = useSongLyric({ songInStore });
   
   // const songLists = useGetActuallySongs({ songInStore });

   // define callback functions
   const handleSetSongWhenClick = (song: Song, index: number) => {
      if (songInStore.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index, song_in: songInStore.song_in }));
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

   const classes = {
      button: `p-[8px] bg-gray-500 bg-opacity-20 text-xl ${theme.content_hover_text}`,
      mainContainer: `fixed inset-0 z-50 bg-zinc-900  overflow-hidden text-white  ${
         isOpenFullScreen ? "translate-y-0" : "translate-y-full"
      } transition-[transform] duration-300 ease-in-out delay-150`,
      bg: `absolute h-[100vh] w-[100vw] -z-10 inset-0 bg-no-repeat bg-cover bg-center blur-[99px] transition-[background] duration-100`,
      overplay: `absolute h-[100vh] w-[100vw] inset-0 bg-zinc-900 bg-opacity-80 bg-blend-multiply`,
      header: `header-left flex px-10 py-[20px] relative h-[75px] max-[549px]:px-[10px]`,
      headerRight: `flex items-center absolute right-10 gap-[10px] max-[549px]:right-[10px] top-0 h-full ${
         idle ? "hidden" : ""
      }`,

      contentContainer: `h-[calc(100%-100px)] max-[549px]:h-[calc(100%-150px)] relative overflow-hidden`,
      songsListTab: `${
         activeTab !== "Songs" ? "opacity-0" : ""
      } relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth max-[549px]:px-[150px] px-[calc(50%-390px/2)]`,

      absoluteButton: `p-[8px] bg-gray-500 bg-opacity-50 text-xl fixed top-1/2 -translate-y-1/2 max-[549px]:hidden`,
      songNameSinger: "relative text-center text-white text-[14px] opacity-80",
      lyricTabContainer:
         "px-[40px] h-full w-full flex items-center justify-center flex-row",
      lyricContainer: "flex-grow ml-[50px] max-[549px]:ml-0 h-full overflow-hidden",
   };

   // define jsx
   const renderSongsList = useMemo(() => {
      if (!songLists.length) return;

      return songLists.map((song, index) => {
         const isActive = index === songInStore.currentIndex;

         return (
            <SongThumbnail
               key={index}
               classNames="items-end justify-center flex-shrink-0 w-[350px] h-[350px]"
               hasHover
               hasTitle
               containerRef={containerRef}
               onClick={() => handleSetSongWhenClick(song, index)}
               active={isActive}
               data={song}
               scroll
            />
         );
      });
   }, [songInStore, songLists]);
   const renderLyricTab = (
      <div className={classes.lyricTabContainer}>
         {/* left */}
         <SongThumbnail active={true} data={songInStore} scroll={false} />

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
               <div className={`${classes.headerRight}`}>
                  {songInStore.by != "admin" && (
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
               <div ref={containerRef} className={` ${classes.songsListTab}`}>
                  {renderSongsList}

                  <Button
                     onClick={() => handleClickToScroll("previous")}
                     variant={"circle"}
                     size={"large"}
                     className={`${classes.absoluteButton} left-[20px]`}
                  >
                     <ChevronLeftIcon />
                  </Button>

                  <Button
                     onClick={() => handleClickToScroll("next")}
                     variant={"circle"}
                     size={"large"}
                     className={`${classes.absoluteButton} right-[20px]`}
                  >
                     <ChevronRightIcon />
                  </Button>
               </div>

               {isOpenFullScreen && activeTab === "Lyric" && (
                  <div className="absolute inset-0 z-20  ">{renderLyricTab}</div>
               )}
            </div>

            {isOpenFullScreen && activeTab === "Lyric" && (
               <p className={classes.songNameSinger}>
                  {songInStore.name} -{" "}
                  <span className="opacity-30">{songInStore.singer}</span>
               </p>
            )}
         </div>
      </div>
   );
}
