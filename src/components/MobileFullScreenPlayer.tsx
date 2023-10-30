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
import {
   selectAllSongStore,
   setSong,
   useTheme,
   // useAuthStore,
   useActuallySongs,
} from "../store";

import { Song } from "../types";
import { useGetSongLyric, useBgImage } from "../hooks";

import {
   Tabs,
   ScrollText,
   SongThumbnail,
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
   // idle,
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
   // const [isClickSetting, setIsClickSetting] = useState(false);
   const [activeTab, setActiveTab] = useState<string>("Playing");
   const [scalingImage, _setScalingImage] = useState(false);
   // const [setOpenModal, setIsOpenModal] = useState(false);
   // const modalName = useRef<"theme" | "info" | "confirm">("theme");

   // ref
   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const lyricContainerRef = useRef<HTMLDivElement>(null);
   const songListContainer = useRef<HTMLDivElement>(null);

   // use hooks
   useBgImage({ bgRef, songInStore });
   const songLyric = useGetSongLyric({ songInStore, audioEle });

   // const { refs, floatingStyles, context } = useFloating({
   //    open: isClickSetting,
   //    onOpenChange: setIsClickSetting,
   //    placement: "bottom-start",
   //    middleware: [offset(10), flip(), shift()],
   //    whileElementsMounted: autoUpdate,
   // });
   // const click = useClick(context);
   // const dismiss = useDismiss(context);
   // const role = useRole(context);
   // const { getReferenceProps, getFloatingProps } = useInteractions([
   //    click,
   //    dismiss,
   //    role,
   // ]);

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
      height: "0px",
      opacity: "0",
      padding: "0px 5px",
      border: "none",
   };

   const findPrevSibling = (ele: HTMLDivElement) => {
      let i = 0;
      let node = ele.previousElementSibling as HTMLElement | null;
      while (node && i < 20) {
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

      const prevSiblingList = findPrevSibling(parent);
      Object.assign(parent.style, hideSongItemStyle);

      console.log("check previousSibling", prevSiblingList);

      setTimeout(() => {
         dispatch(
            setSong({ ...song, currentIndex: index, song_in: songInStore.song_in })
         );
      }, 250);
   };

   useEffect(() => {
      volumeLineWidth.current = volumeLine.current?.offsetWidth;
      // const containerEle = containerRef.current as HTMLElement;
      // const lyricContainerEle = lyricContainerRef.current as HTMLElement;

      // containerEle.style.height = `${windowHeight - 65}px`;
      // lyricContainerEle.style.height = `${windowHeight - (65 + 60 + 20) - 120}px`;
   }, []);

   const songsListItemTab = useMemo(() => {
      return (
         <>
            {songInStore && (
               <>
                  <h3 className="text-white text-[16px] mt-[10px] mb-[7px]">
                     Playing next
                  </h3>
                  {songInStore.currentIndex === actuallySongs.length - 1 ? (
                     <p>...</p>
                  ) : (
                     <div
                        ref={songListContainer}
                        className="relative h-full no-scrollbar overflow-auto transition-transform duration-200"
                     >
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
                     </div>
                  )}
               </>
            )}
         </>
      );
   }, [songInStore, actuallySongs]);

   const lyricTab = useMemo(
      () => (
         <LyricsList
            className="flex-shrink-0 overflow-auto"
            audioEle={audioEle}
            songLyric={songLyric}
         />
      ),
      [songLyric]
   );

   const classes = {
      header: "h-[65px] p-[15px]",
      main: "h-[calc(100vh-65px)] relative px-[15px] overflow-hidden min-[549px]:flex",
      songImage: "flex-shrink-0 transition-[height, width] origin-top-left",
      nameAndSinger: "flex flex-grow justify-between items-center",
      scrollText: "h-[30px] mask-image-horizontal",
      lyricContainer:
         "absolute top-[60px] bottom-[110px] min-[549px]:relative overflow-hidden left-[15px] right-[15px]",
      playerContainer: "absolute bottom-[30px] left-[15px] right-[15px]",
      bgImage: "absolute inset-0 bg-no-repeat bg-cover bg-center blur-[50px]",
      overlay: "absolute inset-0 bg-zinc-900 bg-opacity-60 bg-blend-multiply",
      button: "bg-gray-500 bg-opacity-20 rounded-full absolute",
   };

   return (
      <>
         <div
            className={`fixed inset-0 z-50 bg-zinc-900 text-white overflow-hidden  ${
               isOpenFullScreen ? "translate-y-0" : "translate-y-full"
            } transition-[transform] duration-300 ease-in-out delay-150  `}
         >
            <div ref={bgRef} className={classes.bgImage}></div>
            <div className={classes.overlay}></div>

            <div className="absolute inset-0 z-10">
               {/* header */}
               <div className={classes.header}>
                  {/* <button
                     ref={refs.setReference}
                     {...getReferenceProps()}
                     className={`${classes.button} p-[5px]   left-[15px]`}
                  >
                     <Cog6ToothIcon className="w-[25px]" />
                  </button> */}

                  <Tabs
                     className="w-fit"
                     setActiveTab={setActiveTab}
                     activeTab={activeTab}
                     tabs={["Songs", "Playing", "Lyric"]}
                  />

                  <button
                     className={`${classes.button} right-[15px] top-[15px] p-[6px]`}
                     onClick={() => setIsOpenFullScreen(false)}
                  >
                     <ChevronDownIcon className="w-[25px]" />
                  </button>
                  {/* 
                  {isClickSetting && (
                     <FloatingFocusManager context={context} modal={false}>
                        <div
                           className="z-[99]"
                           ref={refs.setFloating}
                           style={floatingStyles}
                           {...getFloatingProps()}
                        >
                           <SettingMenu
                              setIsOpenModal={setIsOpenModal}
                              modalName={modalName}
                              loggedIn={!!userInfo.email}
                              setIsOpenMenu={setIsClickSetting}
                           />
                        </div>
                     </FloatingFocusManager>
                  )} */}
               </div>

               {/* container */}
               <div ref={containerRef} className={classes.main}>
                  {/* songImage, name and singer */}
                  <div className={`${activeTab != "Playing" && !scalingImage && "flex"}`}>
                     {/* song image */}
                     {useMemo(
                        () => (
                           <SongThumbnail
                              theme={theme}
                              classNames={`${classes.songImage} ${
                                 activeTab != "Playing"
                                    ? "max-[549px]:w-[60px] max-[549px]:h-[60px]"
                                    : "justify-center items-center w-full px-[20px]"
                              }`}
                              active={true}
                              data={songInStore}
                           />
                        ),
                        [songInStore, isPlaying, activeTab]
                     )}
                     {/* name and singer */}
                     <div
                        className={`${classes.nameAndSinger} ${
                           activeTab != "Playing" ? "ml-[10px]" : "mt-[15px]"
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
                                          activeTab === "Playing"
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
                                          activeTab === "Playing"
                                             ? "text-[22px]"
                                             : "text-[16px] text-gray-500"
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

                  <div
                     ref={lyricContainerRef}
                     className={`${classes.lyricContainer} ${
                        activeTab === "Lyric" ? "block" : "hidden"
                     }`}
                  >
                     <div className={`relative h-full`}>{lyricTab}</div>
                  </div>
                  <div
                     className={`absolute h-full top-[60px] w-full ${
                        activeTab === "Songs" ? "block" : "hidden"
                     }`}
                  >
                     <div className={`relative`}>{songsListItemTab}</div>
                  </div>

                  {/* player */}
                  <div
                     className={`${classes.playerContainer} ${
                        activeTab === "Songs" &&
                        "opacity-0 pointer-events-none h-[0px] mb-[0px]"
                     }`}
                  >
                     <div className="flex flex-col justify-start flex-1">
                        <div className="flex-col-reverse flex">
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
         </div>
      </>
   );
}
