import {
   Dispatch,
   SetStateAction,
   useRef,
   useState,
   useEffect,
   useMemo,
   MouseEvent,
} from "react";

import { ChevronDownIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong, useTheme, useActuallySongs } from "../store";

import { Song } from "../types";
import { useGetSongLyric, useBgImage } from "../hooks";

import {
   Tabs,
   ScrollText,
   Control,
   LyricsList,
   MobileSongItem,
} from "../components";

type Props = {
   audioEle: HTMLAudioElement;
   idle: boolean;
   isPlaying: boolean;
   isOpenFullScreen: boolean;
   isWaiting: boolean;

   setIsWaiting: Dispatch<SetStateAction<boolean>>;
   setIsPlaying: Dispatch<SetStateAction<boolean>>;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
};

export default function MobileFullScreenPlayer({
   audioEle,
   isPlaying,
   isWaiting,
   isOpenFullScreen,

   setIsPlaying,
   setIsWaiting,
   setIsOpenFullScreen,
}: Props) {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   // const { userInfo } = useAuthStore();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { actuallySongs } = useActuallySongs();

   // state
   const [activeTab, setActiveTab] = useState<string>("Playing");
   const [scalingImage, _setScalingImage] = useState(false);

   // ref
   const [isLandscape, setIsLandscape] = useState(false);
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const lyricContainerRef = useRef<HTMLDivElement>(null);

   // use hooks
   useBgImage({ bgRef, songInStore });
   const {loading, songLyric} = useGetSongLyric({audioEle, isOpenFullScreen, songInStore})

   const findParent = (ele: HTMLDivElement) => {
      let i = 0;
      let parent = ele.parentElement as HTMLDivElement;
      while (!parent.classList.contains("item-container") && i < 5) {
         parent = parent.parentElement as HTMLDivElement;
         i++;
      }
      return parent;
   };

   const hideSongItemStyle = {
      opacity: "0",
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

   const activeSong = (
      e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
      song: Song,
      index: number
   ) => {
      const ele = e.target as HTMLDivElement;
      const parent = findParent(ele);

      hideSibling(parent);
      Object.assign(parent.style, hideSongItemStyle);

      setTimeout(() => {
         dispatch(
            setSong({ ...song, currentIndex: index, song_in: songInStore.song_in })
         );
      }, 250);
   };

   const songsListItemTab = useMemo(() => {
      return (
         <>
            {songInStore && (
               <>
                  {songInStore.currentIndex === actuallySongs.length - 1 ? (
                     <p>...</p>
                  ) : (
                     <>
                        {actuallySongs.map((song, index) => {
                           if (index > songInStore.currentIndex) {
                              return (
                                 <MobileSongItem
                                    key={index}
                                    theme={theme}
                                    data={song}
                                    onClick={(e) => activeSong(e, song, index)}
                                    active={song.song_url === songInStore.song_url}
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
   }, [songInStore, actuallySongs]);

   const lyricTab = useMemo(
      () => (
         <LyricsList
            className="h-[calc(100vh-60px-65px-130px-20px)]"
            audioEle={audioEle}
            loading={loading}
            songLyric={songLyric}
         />
      ),
      [isLandscape]
   );

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > 549 && window.innerWidth < 800) setIsLandscape(true);
         else setIsLandscape(false);
      };

      handleResize();

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const classes = {
      headerWrapper: "h-[65px] p-[15px]",
      header: "relative w-full",
      main: "h-[calc(100vh-65px)] relative px-[15px] overflow-hidden",
      songImage: "flex-shrink-0 transition-[height, width] origin-top-left",
      nameAndSinger: "flex flex-grow justify-between items-center",
      scrollText: "h-[30px] mask-image-horizontal",
      lyricContainer: "absolute top-[calc(60px+16px)] left-[15px] right-[15px]",
      playerContainer: "absolute bottom-[30px] left-[15px] right-[15px]",
      bgImage:
         "absolute inset-0 bg-no-repeat bg-cover bg-center blur-[50px] transition-[background-image] duration-[.3s ]",
      overlay: "absolute inset-0 bg-zinc-900 bg-opacity-60 bg-blend-multiply",
      button:
         "bg-gray-500 bg-opacity-20 inline-flex justify-center items-center rounded-full absolute right-0 top-0 h-full w-[35px]",
   };
   

   return (
      <>
         <div
            className={`fixed inset-0 z-50 bg-zinc-900 text-white overflow-hidden  ${
               isOpenFullScreen ? "translate-y-0" : "translate-y-full"
            } transition-[transform] duration-[.5s] ease-in-out delay-150  `}
         >
            <div ref={bgRef} className={classes.bgImage}></div>
            <div className={classes.overlay}></div>

            <div className="absolute inset-0 z-10">
               {/* header */}
               <div className={classes.headerWrapper}>
                  <div className={classes.header}>
                     <Tabs
                        className="w-fit"
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        tabs={["Songs", "Playing", "Lyric"]}
                     />

                     <button
                        className={`${classes.button} p-[6px]`}
                        onClick={() => setIsOpenFullScreen(false)}
                     >
                        <ChevronDownIcon className="w-[20px]" />
                     </button>
                  </div>
               </div>

               {/* container */}
               <div ref={containerRef} className={classes.main}>
                  {/* songImage, name and singer */}
                  <div
                     className={`${
                        (activeTab != "Playing" && !scalingImage) || isLandscape
                           ? "flex"
                           : ""
                     }`}
                  >
                     {/* song image */}
                     {/* {useMemo(
                        () => (
                           <MobileSongThumbnail
                              active={activeTab === "Playing" && !isLandscape}
                              data={songInStore}
                           />
                        ),
                        [songInStore, isPlaying, activeTab, isLandscape]
                     )} */}

                     {/* name and singer */}
                     <div
                        className={`${classes.nameAndSinger} ${
                           activeTab != "Playing" || isLandscape
                              ? "ml-[10px]"
                              : "mt-[15px] min-[549px]:mt-0"
                        }`}
                     >
                        <div className="group flex-grow overflow-hidden">
                           <div className={classes.scrollText}>
                              {useMemo(
                                 () => (
                                    <ScrollText
                                       songInStore={songInStore}
                                       autoScroll
                                       classNames={`${
                                          activeTab === "Playing" || isLandscape
                                             ? "text-[24px] leading-[30px]"
                                             : "text-[20px]"
                                       } font-[500]`}
                                       label={songInStore.name || "..."}
                                    />
                                 ),
                                 [songInStore, activeTab]
                              )}
                           </div>
                           <div className={classes.scrollText}>
                              {useMemo(
                                 () => (
                                    <ScrollText
                                       songInStore={songInStore}
                                       autoScroll
                                       classNames={`${
                                          activeTab === "Playing" || isLandscape
                                             ? "text-[22px]"
                                             : "text-[16px] opacity-60"
                                       } font-[400]`}
                                       label={songInStore.singer || "..."}
                                    />
                                 ),
                                 [songInStore, activeTab]
                              )}
                           </div>
                        </div>

                        <div className="pl-[20px]">
                           <button className="p-[5px]">
                              <HeartIcon className="w-[25px]" />
                           </button>
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
                     {lyricTab}
                  </div>

                  {/* song list tab */}
                  {/* <div
                     className={`absolute left-[15px] right-[15px] ${
                        activeTab === "Songs" ? "block" : "hidden"
                     }`}
                  >
                     <div className="relative">
                        <h3 className="text-white text-[16px] my-[10px]">Playing next</h3>
                        <div className="h-[calc(100vh-170px)] pb-[30px] no-scrollbar overflow-auto">
                           {songsListItemTab}
                        </div>
                     </div>
                  </div> */}

                  {/* control */}
                  <div
                     className={`${classes.playerContainer} ${
                        activeTab === "Songs" &&
                        "opacity-0 pointer-events-none h-[0px] mb-[0px]"
                     }`}
                  >
                     <div className="flex flex-col-reverse justify-between h-[100px]">
                        {useMemo(
                           () => (
                              <Control
                                 audioEle={audioEle}
                                 isOpenFullScreen={false}
                                 isPlaying={isPlaying}
                                 isWaiting={isWaiting}
                                 setIsWaiting={setIsWaiting}
                                 setIsPlaying={setIsPlaying}
                                 idle={false}
                              />
                           ),
                           [isPlaying, isWaiting]
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
