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
   SpeakerWaveIcon,
   SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import { Lyric, Song } from "../types";

import SongThumbnail from "./ui/SongThumbnail";
import Tabs from "./ui/Tabs";
import Button from "./ui/Button";
import SongListItem from "./ui/SongListItem";
import ScrollText from "./ui/ScrollText";

import SettingMenu from "./SettingMenu";
import Modal from "./Modal";
import Control from "./Control";
import useVolume from "../hooks/useVolume";
import { useSongs } from "../store/SongsContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import LyricsList from "./LyricsList";

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
   const { songs } = useSongs();

   const songStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const { song: songInStore } = songStore;
   const { theme } = useTheme();

   const [songLyric, setSongLyric] = useState<Lyric>({ base: "", real_time: [] });
   const [isOpenSetting, setIsOpenSetting] = useState(false);
   const [isClickSetting, setIsClickSetting] = useState(false);

   const [activeTab, setActiveTab] = useState<string>("Playing");
   const [settingComp, setSettingComp] = useState<ReactNode>();
   const [scalingImage, setScalingImage] = useState(false);

   const prevTab = useRef(activeTab);
   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const volumeProcessLine = useRef<HTMLDivElement>(null);
   const bgRef = useRef<HTMLDivElement>(null);

   const DURATION = 200;

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

   useEffect(() => {
      if (
         !(
            (prevTab.current === "Songs" && activeTab === "Lyric") ||
            (prevTab.current === "Lyric" && activeTab === "Songs")
         )
      ) {
         if (prevTab.current != activeTab) setScalingImage(true);
         setTimeout(() => {
            setScalingImage(false);
         }, DURATION + 100);
      }

      // return here cause clean up function don't run
      // return;

      return () => {
         prevTab.current = activeTab;
      };
   }, [activeTab]);

   const songsListItemTab = useMemo(() => {
      return (
         <>
            {songInStore && (
               <>
                  <h3 className="text-white text-[16px] mt-[10px] mb-[7px]">
                     Playing next
                  </h3>
                  <div className="relative h-full no-scrollbar overflow-auto transition-all">
                     {songs.map((song, index) => {
                        if (
                           index == songInStore.currentIndex! ||
                           index <= songInStore.currentIndex!
                        )
                           return;
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

   const lyricTab = useMemo(
      () => <LyricsList className="h-[calc(100vh-165px)] flex-shrink-0 overflow-auto" audioEle={audioEle} songLyric={songLyric} />,
      [songInStore, songLyric, activeTab]
   );

   useEffect(() => {
      if (!songInStore.lyric_id) return;

      const getLyric = async () => {
         const docRef = doc(db, "lyrics", songInStore.lyric_id);
         const docSnap = await getDoc(docRef);

         const lyricsData = docSnap.data() as Lyric;

         if (lyricsData) {
            setSongLyric(lyricsData);
         }
      };
      getLyric();
   }, [songInStore]);

   // console.log("mobile fullscreen check lyric", songLyric);

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
            {/* header */}
            <div className="h-[65px] p-[15px]">
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

            {/* container */}
            <div className={`relative h-[calc(100vh-65px)] px-[15px] overflow-hidden`}>
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
                                 classNames={`flex-shink-0 ${activeTab != "Playing" ? "max-[549px]:w-[100px] max-[549px]:h-[100px]" : "justify-center items-center"
                                 }`}
                                 active={activeTab === 'Playing' ?  isPlaying : true}
                                 data={songInStore}
                              />
                           ),
                           [songInStore, isPlaying, activeTab]
                        )}
                        {/* name and singer */}
                        <div
                           className={`flex flex-row flex-grow justify-between items-center transition-[opacity] duration-[${
                              DURATION + 300
                           }] ${activeTab != "Playing" ? "opacity-0 h-[0px]" : ""} ${
                              activeTab != "Playing" && !scalingImage
                                 ? "opacity-100 h-[unset] ml-[10px]"
                                 : ""
                           }
                           `}
                        >
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
                     </div>

                     {activeTab === "Lyric" && lyricTab}
                     {activeTab === "Songs" && songsListItemTab}

                     {/* player */}
                     <div
                        className={`mb-[20px] ${
                           activeTab != "Playing" ? "opacity-0 pointer-events-none h-[0px] mb-[0]" : ""
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
                                    theme.type === "light" ? "bg-gray-400" : "bg-gray-200"
                                 }`}
                              >
                                 <div
                                    ref={volumeProcessLine}
                                    className={`absolute left-0 top-0 h-full w-full ${theme.content_bg}`}
                                 ></div>
                              </div>
                              <Button className="w-[28px] h-[28px]">
                                 <SpeakerWaveIcon />
                              </Button>
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
