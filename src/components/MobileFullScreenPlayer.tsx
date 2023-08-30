import {
   Dispatch,
   SetStateAction,
   useRef,
   useState,
   useEffect,
   MouseEvent,
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
   SpeakerWaveIcon,
   SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import { generateSlug } from "../utils/generateSlug";
import { Lyric, Song } from "../types";

import { lyricsStore } from "../lyric";

import SongThumbnail from "./ui/SongThumbnail";
import Tabs from "./ui/Tabs";
import Button from "./ui/Button";
import SongListItem from "./ui/SongListItem";
import ScrollText from "./ui/ScrollText";

import LyricsList from "./LyricsList";
import SettingMenu from "./SettingMenu";
import Modal from "./Modal";
import Control from "./Control";
// import useLocalStorage from "../hooks/useLocalStorage";
import useVolume from "../hooks/useVolume";
// import SongItem from "./ui/SongItem";
import { useSongs } from "../store/SongsContext";

type Props = {
   isOpenFullScreen: boolean;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
   idle: boolean;
   audioEle: HTMLAudioElement;
   isPlaying: boolean;
   setIsPlaying: Dispatch<SetStateAction<boolean>>;
};

export default function MobileFullScreenPlayer({
   isOpenFullScreen,
   setIsOpenFullScreen,
   idle,
   audioEle,
   isPlaying,
   setIsPlaying,
}: Props) {
   const {songs} = useSongs()

   const songStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const { song: songInStore } = songStore;
   const { theme } = useTheme();

   const [isOpenSetting, setIsOpenSetting] = useState(false);
   const [isClickSetting, setIsClickSetting] = useState(false);

   const [activeTab, setActiveTab] = useState<string>("Playing");
   const [settingComp, setSettingComp] = useState<ReactNode>();

   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const volumeProcessLine = useRef<HTMLDivElement>(null);
   const bgRef = useRef<HTMLDivElement>(null);

   const { handleSetVolume, isMute, handleMute } = useVolume(
      volumeLineWidth,
      volumeProcessLine,
      audioEle
   );

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
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   useEffect(() => {
      volumeLineWidth.current = volumeLine.current?.offsetWidth;
   }, []);

   useEffect(() => {
      if (songInStore.image_path) {
         const node = bgRef.current as HTMLElement;
         node.style.backgroundImage = `url(${songInStore.image_path})`;
      }
   }, [songInStore]);

   const renderSongsListItemTab = useMemo(() => {
      // if (!songInStore.currentIndex) return '';

      return (
         <>
            {songInStore && (
               <>
                  <SongListItem
                     theme={theme}
                     data={songInStore}
                     active={false}
                  />
                  <h3 className="text-white text-lg ml-[10px] mt-[10px] mb-[7px]">
                     Playing next
                  </h3>
                  <div className="relative h-full no-scrollbar overflow-auto transition-all">
                     {songs.map((song, index) => {
                        if (index == songInStore.currentIndex! || index <= songInStore.currentIndex!) return;
                        return (
                           <SongListItem
                              autoScroll
                              theme={theme}
                              data={song}
                              onClick={() => activeSong(song, index)}
                              key={index}
                              active={song.song_path === songInStore.song_path}
                           />
                        );
                     })}
                  </div>
               </>
            )}
         </>
      );
   }, [songInStore]);

   const renderLyricTab = useMemo(() => {
      const key = generateSlug(songInStore.name) as keyof typeof lyricsStore;
      return (
         <LyricsList
            audioEle={audioEle}
            lyrics={lyricsStore[key] as Lyric[] | undefined}
         />
      );
   }, [songInStore]);

   // console.log("mobile fullscreen check audioEle", audioEle);

   return (
      <div
         className={`fixed inset-0 z-50 bg-zinc-900  overflow-hidden  ${
            isOpenFullScreen ? "translate-y-0" : "translate-y-full"
         } transition-[transform] duration-300 ease-in-out delay-150  `}
      >
         <div
            ref={bgRef}
            className={`absolute  inset-0 bg-no-repeat bg-cover bg-center blur-[99px] transition-[background] duration-100`}
         ></div>
         <div
            className={`absolute inset-0 bg-zinc-900 bg-opacity-80 bg-blend-multiply`}
         ></div>

         <div className="absolute inset-0 z-10">
            <div className="header h-[65px] p-[15px]">
               <button
                  ref={refs.setReference}
                  {...getReferenceProps()}
                  className="inline-flex items-center rounded-full p-[8px] bg-gray-500 bg-opacity-20 text-xl h-[35px] w-[35px] absolute left-[15px]"
               >
                  <Cog6ToothIcon />
               </button>

               <Tabs
                  className="w-fit"
                  idle={false}
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  tabs={["Songs", "Playing", "Lyric"]}
               />

               <Button
                  className="absolute right-[15px] top-[15px]"
                  variant={"circle"}
                  size={"normal"}
                  onClick={() => setIsOpenFullScreen(false)}
               >
                  <ChevronDownIcon />
               </Button>

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

            <div className={`relative h-[calc(100vh-65px)] px-[15px]`}>
               <div
                  className={`${
                     activeTab != "Playing"
                        ? "opacity-0 pointer-events-none"
                        : "Playing tab h-full flex flex-col overflow-auto"
                  }`}
               >
                  <div className="flex flex-col justify-between h-full">
                     {useMemo(
                        () => (
                           <SongThumbnail
                              active={isPlaying}
                              data={songInStore}
                           />
                        ),
                        [songInStore, isPlaying]
                     )}
                     <div className="player mb-[20px]">
                        <div className="flex flex-row justify-between items-center my-[10px]">
                           <div className="group flex-grow overflow-hidden">
                              {useMemo(
                                 () => (
                                    <ScrollText label={songInStore.name} />
                                 ),
                                 [songInStore]
                              )}
                              <p className="text-md opacity-50">
                                 {songInStore.singer || "..."}
                              </p>
                           </div>

                           <div className="group pl-[20px]">
                              <Button
                                 variant={"default"}
                                 size={"small"}
                                 className="sm text-gray-500"
                              >
                                 <HeartIcon />
                              </Button>
                           </div>
                        </div>

                        <div className="flex flex-col justify-start flex-1">
                           <div className="flex-col-reverse flex">
                              {useMemo(
                                 () => (
                                    <Control
                                       audioEle={audioEle}
                                       isOpenFullScreen={false}
                                       isPlaying={isPlaying}
                                       setIsPlaying={setIsPlaying}
                                       idle={false}
                                    />
                                 ),
                                 [isPlaying]
                              )}
                           </div>

                           <div className="flex flex-row items-center gap-[10px]">
                              <Button
                                 onClick={() => handleMute()}
                                 className={`w-[28px] h-[28px] ${
                                    isMute && theme.content_text
                                 }`}
                              >
                                 <SpeakerXMarkIcon />
                              </Button>
                              <div
                                 ref={volumeLine}
                                 onClick={(e) => handleSetVolume(e)}
                                 className={`h-[4px] bg-gray-300 flex-1 relative 
                                 cursor-pointer rounded-3xl overflow-hidden ${
                                    theme.type === "light"
                                       ? "bg-gray-400"
                                       : "bg-gray-200"
                                 }`}
                              >
                                 <div
                                    ref={volumeProcessLine}
                                    className={`absolute left-0 top-0 h-full w-full ${theme.content_bg}`}
                                 ></div>
                                 {/* <div className="absolute right-0 h-[15px] w-[15px] rounded-full bg-[#fff]"></div> */}
                              </div>
                              <Button className="w-[28px] h-[28px]">
                                 <SpeakerWaveIcon />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {activeTab === "Songs" && (
                  <div className="songs-list-item-tab absolute inset-0 z-10">
                     {renderSongsListItemTab}
                  </div>
               )}

               {activeTab === "Lyric" && (
                  <div className="lyric-tab absolute  inset-0 z-10">
                     <div className="relative overflow-auto h-full px-[15px]">
                        {renderLyricTab}
                     </div>
                  </div>
               )}
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
