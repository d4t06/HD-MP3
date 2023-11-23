import {
   ChevronDownIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
   DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
   Dispatch,
   SetStateAction,
   useMemo,
   useRef,
   useState,
   forwardRef,
   useImperativeHandle,
   useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Song } from "../types";
import { selectAllSongStore, setSong, useTheme, useActuallySongs } from "../store";
import { SongThumbnail, Button, Tabs, LyricsList } from ".";
import { useScrollSong, useBgImage } from "../hooks";
import useDebounce from "../hooks/useDebounced";

interface Props {
   isOpenFullScreen: boolean;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
   idle: boolean;
   audioEle: HTMLAudioElement;
   setIsPlaying?: () => void;
}
function FullScreenPlayer(
   { isOpenFullScreen, setIsOpenFullScreen, idle, audioEle }: Props,
   ref: any
) {
   // define store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { actuallySongs } = useActuallySongs();
   // state
   const [activeTab, setActiveTab] = useState<"Songs" | "Lyric">("Lyric");
   //  ref
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const activeSongRef = useRef<HTMLDivElement>(null);
   const firstTimeRender = useRef(true);

   // use hooks
   const navigate = useNavigate();
   useBgImage({ bgRef, songInStore });

   const { scrollToActiveSong } = useScrollSong({
      containerRef,
      songItemRef: activeSongRef,
      firstTimeRender,
      isOpenFullScreen: isOpenFullScreen,
   });

   // methods
   const handleClickNext = useDebounce(
      () => handleScroll("next"),
      scrollToActiveSong,
      isOpenFullScreen,
      300
   );
   const handleClickPrevious = useDebounce(
      () => handleScroll("previous"),
      scrollToActiveSong,
      isOpenFullScreen,
      300
   );

   //  const handleScrollTouchpad = useDebounce(
   //     () => {},
   //     scrollToActiveSong,
   //     isOpenFullScreen,
   //     300
   //  );

   const handleSetSongWhenClick = (song: Song, index: number) => {
      if (songInStore.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index, song_in: songInStore.song_in }));
   };

   const handleScroll = (direction: string = "next") => {
      const containerEle = containerRef.current as HTMLElement;
      containerEle.style.scrollBehavior = "smooth";

      if (direction === "next") {
         containerEle.scrollLeft += 500;
      } else if (direction === "previous") {
         containerEle.scrollLeft -= 500;
      }

      window.dispatchEvent(new Event("mousemove"));
   };

   const handleEdit = () => {
      setIsOpenFullScreen(false);

      setTimeout(() => {
         navigate(`/mysongs/edit/${songInStore.id}`);
      }, 300);
   };

   useImperativeHandle(ref, () => activeSongRef, []);

   //  useEffect(() => {
   //     if (containerRef) {
   //        const containerEle = containerRef.current as HTMLDivElement;

   //        containerEle.addEventListener("scroll", handleScrollTouchpad);
   //     }

   //     return () => {
   //        const containerEle = containerRef.current as HTMLDivElement;

   //        if (containerEle)
   //           containerEle.removeEventListener("scroll", handleScrollTouchpad);
   //     };
   //  }, []);

   const classes = {
      button: `p-[8px] bg-gray-500 bg-opacity-20 text-xl ${theme.content_hover_text}`,
      mainContainer: `fixed inset-0 z-10 overflow-hidden text-white bg-zinc-900 ${
         isOpenFullScreen ? "translate-y-0" : "translate-y-full"
      } transition-[transform] duration-[.5s] linear delay-100`,
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
         "px-[40px] h-full w-full flex items-center justify-center flex-row",
      songThumbnail: "items-end justify-center flex-shrink-0 w-[350px] h-[350px]",

      fadeTransition: "opacity-0 transition-opacity duration-[.3s]",
   };

   // define jsx
   const renderSongsList = useMemo(() => {
      if (!songInStore.id) return;
      if (!actuallySongs.length) return;

      return actuallySongs.map((song, index) => {
         const isActive = index === songInStore.currentIndex;
         if (isActive) {
            return (
               <SongThumbnail
                  theme={theme}
                  key={index}
                  ref={activeSongRef}
                  hasTitle
                  onClick={() => handleSetSongWhenClick(song, index)}
                  active={isActive}
                  data={song}
                  classNames={classes.songThumbnail}
               />
            );
         }

         return (
            <SongThumbnail
               theme={theme}
               key={index}
               classNames={classes.songThumbnail}
               idleClass={`${!isActive && idle && classes.fadeTransition}`}
               hasTitle
               active={isActive}
               data={song}
               onClick={() => handleSetSongWhenClick(song, index)}
            />
         );
      });
   }, [songInStore, actuallySongs, idle]);

   const renderLyricTab = (
      <div className={classes.lyricTabContainer}>
         {/* left */}
         <SongThumbnail
            classNames={`opacity-0 transition-opacity delay-400 ${
               isOpenFullScreen ? "opacity-100" : ""
            }`}
            theme={theme}
            active={true}
            data={songInStore}
         />
         {/* right */}

         <LyricsList
            className={"w-full ml-[50px] h-full"}
            audioEle={audioEle}
            isOpenFullScreen={isOpenFullScreen}
         />
      </div>
   );

   return (
      <div className={`${classes.mainContainer}`}>
         {/* bg image */}
         <div ref={bgRef} className={`${classes.absoluteFull} ${classes.bg}`}></div>
         <div className={`${classes.absoluteFull} ${classes.overplay}`}></div>

         <div className="h-[calc(100vh-90px)]">
            {/* header */}
            <div className={classes.headerWrapper}>
               <div className={classes.header}>
                  {/* left */}
                  {idle && activeTab === "Lyric" && (
                     <div className={`${classes.headerCta} left-0`}>
                        <img
                           className={`${idle ? "h-full" : "h-full"} mr-[10px]`}
                           src="https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                           alt=""
                        />
                        <p className={`${classes.songNameSinger}`}>
                           {songInStore.name} -{" "}
                           <span className="opacity-30">{songInStore.singer}</span>
                        </p>
                     </div>
                  )}
                  {/* tabs */}
                  <Tabs
                     inFullScreen
                     activeTab={activeTab}
                     setActiveTab={setActiveTab}
                     className={`${idle && classes.fadeTransition}`}
                     tabs={["Songs", "Lyric"]}
                     render={(tab) => tab}
                  />
                  {/* right */}
                  <div
                     className={`${classes.headerCta} right-0 gap-[10px] ${
                        idle && classes.fadeTransition
                     }`}
                  >
                     {songInStore.by != "admin" && activeTab === "Lyric" && (
                        <Button
                           onClick={() => handleEdit()}
                           variant={"circle"}
                           className={`p-[4px] ${classes.button}`}
                        >
                           <DocumentTextIcon className="w-[20px]" />
                        </Button>
                     )}

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
                  className={` ${classes.songsListTab} ${
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
            </div>

            {isOpenFullScreen && activeTab === "Lyric" && !idle && (
               <p
                  className={`${classes.songNameSinger} ${
                     idle && classes.fadeTransition
                  }`}
               >
                  {songInStore.name} -{" "}
                  <span className="opacity-30">{songInStore.singer}</span>
               </p>
            )}
         </div>
      </div>
   );
}

export default forwardRef(FullScreenPlayer);
