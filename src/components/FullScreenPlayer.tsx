import {
   ChevronDownIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
   Cog6ToothIcon,
   DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";
import { SongThumbnail, Button, Tabs, LyricsList } from ".";
import { useScrollSong, useBgImage } from "../hooks";
import useDebounce from "../hooks/useDebounced";
import logoIcon from "../assets/siteLogo.png";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import FullScreenPlayerSetting from "./child/FullSreenPlayerSetting";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue } from "@/store/songQueueSlice";

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
   const { currentSong } = useSelector(selectCurrentSong);
   const { queueSongs } = useSelector(selectSongQueue);;
   // state
   const [activeTab, setActiveTab] = useState<"Songs" | "Karaoke" | "Lyric">("Lyric");
   //  ref
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const activeSongRef = useRef<HTMLDivElement>(null);

   // use hooks
   const navigate = useNavigate();
   useBgImage({ bgRef, currentSong });
   // dùng hook ở component cha thay vì dùng ở mỗi child
   useScrollSong({
      containerRef,
      songItemRef: activeSongRef,
      isOpenFullScreen: isOpenFullScreen,
      idle,
   });

   // methods
   const handleClickNext = useDebounce(() => handleScroll("next"), 200);
   const handleClickPrevious = useDebounce(() => handleScroll("previous"), 200);

   const handleSetSongWhenClick = (song: Song, index: number) => {
      if (currentSong.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index, song_in: currentSong.song_in }));
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

   const handleEdit = () => {
      setIsOpenFullScreen(false);

      setTimeout(() => {
         navigate(`/mysongs/edit/${currentSong.id}`);
      }, 300);
   };

   const classes = {
      button: `p-[8px] bg-gray-500 bg-opacity-20 text-xl ${theme.content_hover_text}`,
      mainContainer: `fixed inset-0 z-50 overflow-hidden text-white bg-zinc-900
    } transition-[transform] duration-[.7s] linear delay-100`,
      bg: `-z-10 bg-no-repeat bg-cover bg-center blur-[50px] transition-[background] duration-100`,
      overplay: `bg-zinc-900 bg-opacity-60 bg-blend-multiply`,
      absoluteFull: "absolute h-[100vh] w-[100vw] inset-0",

      headerWrapper: `py-[20px] px-[40px] w-full h-[75px]`,
      header: "relative flex",
      headerCta: "absolute h-full flex items-center",

      contentContainer: `h-[calc(100%-100px)] song-thumbnail-container relative overflow-hidden`,
      songsListTab: ` relative h-full no-scrollbar flex items-center flex-row overflow-auto scroll-smooth px-[calc(50%-350px/2)]`,
      absoluteButton: `absolute top-[50%] -translate-y-[50%] p-[8px] bg-[#fff] bg-opacity-[.2] hover:opacity-100 rounded-full ${theme.content_hover_text}`,
      songNameSinger: "relative text-center text-white text-[14px] opacity-80",
      lyricTabContainer:
         "px-[40px] min-[1536px]:container min-[1536px]:mx-auto min-[1536px]:px-[200px] h-full flex items-center justify-center flex-row",
      fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
      before: `before:content-[''] before:w-[50px] before:h-[10px] before:absolute before:bottom-[-7px] `,
      logo: "animate-[spin_8s_linear_infinite] w-[46px] mr-[10px]",
   };

   // define jsx
   const renderSongsList = useMemo(() => {
      if (!currentSong.id) return;
      if (!queueSongs.length) return;

      return queueSongs.map((song, index) => {
         const isActive = index === currentSong.currentIndex;
         if (isActive) {
            return (
               <SongThumbnail
                  theme={theme}
                  key={index}
                  ref={activeSongRef}
                  classNames="active"
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
               idleClass={`${!isActive && idle ? classes.fadeTransition : ""}`}
               hasTitle
               active={isActive}
               data={song}
               onClick={() => handleSetSongWhenClick(song, index)}
            />
         );
      });
   }, [currentSong, queueSongs, idle]);

   const renderLyricTab = (
      <div className={classes.lyricTabContainer}>
         {/* left */}
         <SongThumbnail theme={theme} active={true} data={currentSong} />

         {/* right */}
         <LyricsList
            className={"w-full ml-[40px] h-full"}
            audioEle={audioEle}
            isOpenFullScreen={isOpenFullScreen && activeTab === "Lyric"}
            active={activeTab === "Lyric"}
         />
      </div>
   );

   return (
      <div
         className={`${classes.mainContainer}  ${
            isOpenFullScreen ? "translate-y-0" : "translate-y-full"
         }`}
      >
         {/* bg image */}
         <div ref={bgRef} className={`${classes.absoluteFull} ${classes.bg}`}></div>
         <div className={`${classes.absoluteFull} ${classes.overplay}`}></div>

         <div className="h-[calc(100vh-90px)]">
            {/* header */}
            <div className={classes.headerWrapper}>
               <div className={classes.header}>
                  {/* left */}
                  {idle && (
                     <div className={`${classes.headerCta} left-0`}>
                        <img className={`${classes.logo}`} src={logoIcon} alt="" />
                        {activeTab === "Lyric" && (
                           <p className={`${classes.songNameSinger}`}>
                              {currentSong.name} -{" "}
                              <span className="opacity-30">{currentSong.singer}</span>
                           </p>
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
                     className={`${classes.headerCta} right-0 gap-[10px] ${
                        idle && classes.fadeTransition
                     }`}
                  >
                     {currentSong.by != "admin" && activeTab === "Lyric" && (
                        <Button
                           onClick={() => handleEdit()}
                           variant={"circle"}
                           className={`p-[4px] ${classes.button}`}
                        >
                           <DocumentTextIcon className="w-[20px]" />
                        </Button>
                     )}

                     <Popover placement="bottom-end">
                        <PopoverTrigger
                           className={`h-[36px] rounded-full w-[36px] ${classes.button}`}
                        >
                           <Cog6ToothIcon className="w-[20px]" />
                        </PopoverTrigger>

                        <PopoverContent className="z-[99]">
                           <FullScreenPlayerSetting />
                        </PopoverContent>
                     </Popover>

                     <Button
                        onClick={() => setIsOpenFullScreen(false)}
                        variant={"circle"}
                        className={`p-[4px] ${classes.button}`}
                     >
                        <ChevronDownIcon className="w-[20px]" />
                     </Button>
                  </div>
               </div>
            </div>

            {/* content */}
            <div className={classes.contentContainer}>
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

               {/* lyric tab */}
               <div
                  className={`absolute inset-0 z-20 ${
                     activeTab === "Lyric" ? "" : "hidden"
                  }`}
               >
                  {renderLyricTab}
               </div>
               <div
                  className={`absolute inset-0 z-20 ${
                     activeTab === "Karaoke" ? "" : "hidden"
                  }`}
               >
                  <h1 className="text-center font-semibold opacity-60 relative top-[50%]">
                     Coming soon...
                  </h1>
               </div>
            </div>

            {isOpenFullScreen && activeTab === "Lyric" && !idle && (
               <p
                  className={`${classes.songNameSinger} ${
                     idle && classes.fadeTransition
                  }`}
               >
                  {currentSong.name} -{" "}
                  <span className="opacity-30">{currentSong.singer}</span>
               </p>
            )}
         </div>
      </div>
   );
}

export default FullScreenPlayer;
