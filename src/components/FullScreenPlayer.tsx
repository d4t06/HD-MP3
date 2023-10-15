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
   const timerIdForScroll = useRef<number>();
   const activeSongRef = useRef<HTMLDivElement>(null);
   const firstTimeRender = useRef(true);

   // use hooks
   const navigate = useNavigate();
   const songLyric = useGetSongLyric({ songInStore });
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

   const handleClickToScroll = (direction: string) => {
      const containerEle = containerRef.current as HTMLElement;
      if (direction === "next") {
         containerEle.scrollLeft += 500;

         if (timerIdForScroll.current) {
            clearTimeout(timerIdForScroll.current);
         }
      } else if (direction === "previous") {
         containerEle.scrollLeft -= 500;
      }

      console.log(">>> check scroll left", containerEle.scrollLeft);
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
      } transition-[transform] duration-300 ease-in-out delay-300`,
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

      absoluteButton: `p-[8px] bg-gray-500 bg-opacity-50 text-xl fixed top-1/2 -translate-y-1/2 max-[549px]:hidden opacity-[.5] hover:opacity-100 ${theme.content_hover_text}`,
      songNameSinger: "relative text-center text-white text-[14px] opacity-80",
      lyricTabContainer: "px-[40px] h-full w-full flex items-center justify-center flex-row",
      lyricContainer: "flex-grow ml-[50px] max-[549px]:ml-0 h-full overflow-hidden",
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
                  {songInStore.name} - <span className="opacity-30">{songInStore.singer}</span>
               </p>
            )}
         </div>
      </div>
   );
}
