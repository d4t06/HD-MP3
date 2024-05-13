import {
   Dispatch,
   SetStateAction,
   useRef,
   useState,
   useEffect,
   useMemo,
   MouseEvent,
} from "react";

import { ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../store";

import { useBgImage } from "../hooks";

import {
   Tabs,
   ScrollText,
   Control,
   LyricsList,
   MobileSongItem,
   MobileSongThumbnail,
   Modal,
   TimerModal,
} from "../components";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import FullScreenPlayerSetting from "./child/FullSreenPlayerSetting";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue } from "@/store/songQueueSlice";

type Props = {
   audioEle: HTMLAudioElement;
   isOpenFullScreen: boolean;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
};

type Modal = "timer";

export default function MobileFullScreenPlayer({
   audioEle,
   isOpenFullScreen,
   setIsOpenFullScreen,
}: Props) {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { currentSong } = useSelector(selectCurrentSong);

   const {
      playStatus: { isPlaying },
   } = useSelector(selectAllPlayStatusStore);
   const { queueSongs } = useSelector(selectSongQueue);;

   // state
   const [activeTab, setActiveTab] = useState<"Songs" | "Playing" | "Lyric">("Playing");
   const [scalingImage, _setScalingImage] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   // ref
   const [isLandscape, setIsLandscape] = useState(false);
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const lyricContainerRef = useRef<HTMLDivElement>(null);

   // use hooks
   useBgImage({ bgRef, currentSong });

   const closeModal = () => setIsOpenModal("");

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
            setSong({ ...song, currentIndex: index, song_in: currentSong.song_in })
         );
      }, 250);
   };

   const songsListItemTab = useMemo(() => {
      return (
         <>
            {currentSong && (
               <>
                  {currentSong.currentIndex === queueSongs.length - 1 ? (
                     <p>...</p>
                  ) : (
                     <>
                        {queueSongs.map((song, index) => {
                           if (index > currentSong.currentIndex) {
                              return (
                                 <MobileSongItem
                                    key={index}
                                    theme={theme}
                                    data={song}
                                    onClick={(e) => activeSong(e, song, index)}
                                    active={false}
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
   }, [currentSong, queueSongs]);

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

      // add padding to detect if container is overflow
      main: "h-[calc(100%-65px)] relative px-[15px] overflow-hidden",
      songImage: "flex-shrink-0 transition-[height, width] origin-top-left",
      nameAndSinger: "flex flex-grow justify-between items-center",
      scrollText: "h-[30px] mask-image-horizontal",
      control: "absolute bottom-0 left-[15px] right-[15px]",
      lyricContainer: "absolute top-[65px] bottom-[100px] left-[15px] right-[15px]",
      bgImage:
         "absolute inset-0 bg-no-repeat bg-cover bg-center blur-[50px] transition-[background-image] duration-[.3s ]",
      overlay:
         "absolute inset-0 bg-zinc-900 bg-opacity-60 bg-blend-multiply overflow-hidden",
      button:
         "inline-flex justify-center items-center rounded-full absolute top-0 h-full w-[35px]",
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
                     <Popover placement="bottom-start">
                        <PopoverTrigger
                           className={`${classes.button} p-[6px] left-0 bg-gray-500 bg-opacity-20`}
                        >
                           <Cog6ToothIcon className="w-[20px]" />
                        </PopoverTrigger>
                        <PopoverContent>
                           <FullScreenPlayerSetting />
                        </PopoverContent>
                     </Popover>

                     <Tabs
                        inFullScreen
                        className="w-fit"
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        render={(tab) => tab}
                        tabs={["Songs", "Playing", "Lyric"]}
                     />

                     <button
                        className={`${classes.button} p-[6px] right-0 bg-gray-500 bg-opacity-20`}
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
                     {useMemo(
                        () => (
                           <MobileSongThumbnail
                              active={activeTab === "Playing" && !isLandscape}
                              data={currentSong}
                           />
                        ),
                        [currentSong, isPlaying, activeTab, isLandscape]
                     )}

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
                                       autoScroll
                                       classNames={`${
                                          activeTab === "Playing" || isLandscape
                                             ? "text-[24px] leading-[30px]"
                                             : "text-[20px]"
                                       } font-[500]`}
                                       label={currentSong.name || "..."}
                                    />
                                 ),
                                 [currentSong, activeTab]
                              )}
                           </div>
                           <div className={classes.scrollText}>
                              {useMemo(
                                 () => (
                                    <ScrollText
                                       autoScroll
                                       classNames={`${
                                          activeTab === "Playing" || isLandscape
                                             ? "text-[22px]"
                                             : "text-[16px] opacity-60"
                                       } font-[400]`}
                                       label={currentSong.singer || "..."}
                                    />
                                 ),
                                 [currentSong, activeTab]
                              )}
                           </div>
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
                     {useMemo(
                        () => (
                           <LyricsList
                              active={activeTab === "Lyric"}
                              // className="h-[calc(100vh-60px-65px-130px-20px)]"
                              className="h-full"
                              audioEle={audioEle}
                              isOpenFullScreen={isOpenFullScreen && activeTab === "Lyric"}
                           />
                        ),
                        [isOpenFullScreen, activeTab, isLandscape]
                     )}
                  </div>

                  {/* song list tab */}
                  <div
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
                  </div>

                  {/* control */}
                  <div
                     className={`${classes.control} ${
                        activeTab === "Songs" &&
                        "opacity-0 pointer-events-none h-[0px] mb-[0px]"
                     }`}
                  >
                     <div className="h-[120px]">
                        {useMemo(
                           () => (
                              <Control
                                 className="flex flex-col-reverse justify-between pb-[24px]"
                                 audioEle={audioEle}
                                 isOpenFullScreen={true}
                                 idle={false}
                              />
                           ),
                           [isOpenFullScreen]
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {!!isOpenModal && (
            <Modal closeModal={closeModal}>
               <TimerModal close={closeModal} />
            </Modal>
         )}
      </>
   );
}
