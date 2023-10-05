import {
   Dispatch,
   SetStateAction,
   useRef,
   useState,
   useEffect,
   useMemo,
   ReactNode,
} from "react";
import {
   useFloating,
   autoUpdate,
   offset,
   flip,
   shift,
   FloatingFocusManager,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
} from "@floating-ui/react";

import {
   ChevronDownIcon,
   Cog6ToothIcon,
   HeartIcon,
   // SpeakerWaveIcon,
   // SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import { Song } from "../types";
import useGetSongLyric from "../hooks/useGetSongLyric";

import Tabs from "./ui/Tabs";
import ScrollText from "./ui/ScrollText";
import SongThumbnail from "./ui/SongThumbnail";
import SettingMenu from "./SettingMenu";
import Modal from "./Modal";
import Control from "./Control";
import LyricsList from "./LyricsList";
import MobileSongItem from "./ui/MobileSongItem";
import useBgImage from "../hooks/useBgImage";
// import useGetActuallySongs from "../hooks/useGetActuallySongs";
// import useVolume from "../hooks/useVolume";

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
   const songStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const { song: songInStore } = songStore;
   const { theme } = useTheme();
   // const { actuallySongs } = useActuallySongs();
   // const [songLists, setSongLists] = useState<Song[]>([]);

   // const [songLyric, setSongLyric] = useState<Lyric>({ base: "", real_time: [] });
   const [isOpenSetting, setIsOpenSetting] = useState(false);
   const [isClickSetting, setIsClickSetting] = useState(false);

   const [activeTab, setActiveTab] = useState<string>("Playing");
   const [settingComp, setSettingComp] = useState<ReactNode>();
   const [scalingImage, _setScalingImage] = useState(false);

   // const prevTab = useRef(activeTab);
   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const bgRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   // use hooks
   useBgImage({ bgRef, songInStore });
   const songLyric = useGetSongLyric({ songInStore });
   // const songLists = useGetActuallySongs({ songInStore: songInStore });

   const { refs, floatingStyles, context } = useFloating({
      open: isClickSetting,
      onOpenChange: setIsClickSetting,
      placement: "bottom-start",
      middleware: [offset(10), flip(), shift()],
      whileElementsMounted: autoUpdate,
   });

   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);

   const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
   ]);

   const activeSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index, song_in: songInStore.song_in }));
   };

   useEffect(() => {
      volumeLineWidth.current = volumeLine.current?.offsetWidth;
      const containerEle = containerRef.current as HTMLElement;
      containerEle.style.height = `${window.innerHeight - 65}px`;
   }, []);

   // useEffect(() => {
   //    if (songInStore.image_url) {
   //       const node = bgRef.current as HTMLElement;
   //       node.style.backgroundImage = `url(${songInStore.image_url})`;
   //    }
   // }, [songInStore]);

   // // update songs list
   // useEffect(() => {
   //    if (!initial) return;

   //    // songs in playlist
   //    if (songInStore.song_in.includes("playlist")) {
   //       setSongLists(actuallySongs);

   //       // admin songs
   //    } else if (songInStore.song_in === "admin") {
   //       setSongLists(adminSongs);

   //       // user songs
   //    } else {
   //       setSongLists(userSongs);
   //    }

   //    console.log("check songlist", songLists);
   // }, [songInStore.song_in, actuallySongs]);

   const songsListItemTab = useMemo(() => {
      return (
         <>
            {songInStore && (
               <>
                  <h3 className="text-white text-[16px] mt-[10px] mb-[7px]">
                     Playing next
                  </h3>
                  <div className="relative h-full no-scrollbar overflow-auto transition-all">
                     {/* {songLists.map((song, index) => {
                        if (index > songInStore.currentIndex) {
                           return (
                              <MobileSongItem
                                 key={index}
                                 theme={theme}
                                 data={song}
                                 onClick={() => activeSong(song, index)}
                                 active={song.song_url === songInStore.song_url}
                              />
                           );
                        }
                     })} */}
                  </div>
               </>
            )}
         </>
      );
   }, [songInStore]);

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

   return (
      <div
         className={`fixed inset-0 z-50 bg-zinc-900 text-white overflow-hidden  ${
            isOpenFullScreen ? "translate-y-0" : "translate-y-full"
         } transition-[transform] duration-300 ease-in-out delay-150  `}
      >
         <div
            ref={bgRef}
            className={`absolute  inset-0 bg-no-repeat bg-cover bg-center blur-[99px]`}
         ></div>
         <div
            className={`absolute inset-0 bg-zinc-900 bg-opacity-60 bg-blend-multiply`}
         ></div>

         <div className="absolute inset-0 z-10">
            {/* header */}
            <div className="h-[65px] p-[15px]">
               <button
                  ref={refs.setReference}
                  {...getReferenceProps()}
                  className={`rounded-full p-[5px] bg-gray-500 bg-opacity-20 absolute left-[15px]`}
               >
                  <Cog6ToothIcon className="w-[25px]" />
               </button>

               <Tabs
                  className="w-fit"
                  idle={false}
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  tabs={["Songs", "Playing", "Lyric"]}
               />

               <button
                  className="bg-gray-500 bg-opacity-20 rounded-full absolute right-[15px] top-[15px] p-[6px]"
                  onClick={() => setIsOpenFullScreen(false)}
               >
                  <ChevronDownIcon className="w-[25px]" />
               </button>

               {isClickSetting && (
                  <FloatingFocusManager context={context} modal={false}>
                     <div
                        className="z-[99]"
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                     >
                        <SettingMenu
                           setIsOpenMenu={setIsClickSetting}
                           setIsOpenSetting={setIsOpenSetting}
                           setSettingComp={setSettingComp}
                        />
                     </div>
                  </FloatingFocusManager>
               )}
            </div>

            {/* container */}
            <div ref={containerRef} className={`relative px-[15px] overflow-hidden`}>
               <div className={`h-full flex flex-col overflow-hidden`}>
                  <div
                     className={`flex flex-col h-full ${
                        activeTab != "Playing" ? "" : "justify-between"
                     }`}
                  >
                     {/* songImage, name and singer */}
                     <div
                        className={`${
                           activeTab != "Playing" && !scalingImage ? "flex" : ""
                        }`}
                     >
                        {/* song image */}
                        {useMemo(
                           () => (
                              <SongThumbnail
                                 classNames={`flex-shink-0 transition-[height, width] origin-top-left ${
                                    activeTab != "Playing"
                                       ? "max-[549px]:w-[60px] max-[549px]:h-[60px]"
                                       : "justify-center items-center w-full"
                                 }`}
                                 active={true}
                                 data={songInStore}
                                 scroll={false}
                              />
                           ),
                           [songInStore, isPlaying, activeTab]
                        )}
                        {/* name and singer */}
                        <div
                           className={`flex flex-grow justify-between items-center ${
                              activeTab != "Playing" ? "ml-[10px]" : "mt-[15px]"
                           }`}
                        >
                           <div className="group flex-grow overflow-hidden">
                              <div className="h-[30px]">
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
                              <div className="h-[30px]">
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

                     {activeTab === "Lyric" && lyricTab}
                     {activeTab === "Songs" && songsListItemTab}

                     {/* player */}
                     <div
                        className={`mb-[30px] ${
                           activeTab != "Playing"
                              ? "opacity-0 pointer-events-none h-[0px] mb-[0px]"
                              : ""
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
         </div>

         {isOpenSetting && (
            <Modal setOpenModal={setIsOpenSetting}>
               <div
                  className={` w-[95vw] [90vh] px-[25px] pb-[25px] overflow-hidden ${
                     theme.container
                  } rounded-[8px] ${
                     theme.type === "light" ? "text-[#333]" : "text-white"
                  } `}
               >
                  {settingComp}
               </div>
            </Modal>
         )}
      </div>
   );
}
