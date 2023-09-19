import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import {
   ChevronUpIcon,
   SpeakerWaveIcon,
   SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import Button from "./ui/Button";
import Control from "./Control";
import useVolume from "../hooks/useVolume";
// import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/ToolTip";
import ScrollText from "./ui/ScrollText";

interface Props {
   isOpenFullScreen: boolean;
   idle: boolean;
   audioEle: HTMLAudioElement;
   isPlaying: boolean;
   isWaiting: boolean;

   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
   setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
   setIsWaiting: Dispatch<React.SetStateAction<boolean>>;
}

export default function BottomPlayer({
   idle,
   audioEle,

   isOpenFullScreen,
   isPlaying,
   isWaiting,

   setIsWaiting,
   setIsPlaying,
   setIsOpenFullScreen,
}: Props) {
   const SongStore = useSelector(selectAllSongStore);

   const { song: songInStore } = SongStore;
   const { theme } = useTheme();

   // const [isMute, setIsMute] = useState(false);
   // const [volume, setVolume] = useLocalStorage("volume", 1);

   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const volumeProcessLine = useRef<HTMLDivElement>(null);

   const { handleSetVolume, isMute, handleMute } = useVolume(
      volumeLineWidth,
      volumeProcessLine,
      audioEle
   );

   // update process lines width
   useEffect(() => {
      volumeLineWidth.current = volumeLine.current?.offsetWidth;
   }, [isOpenFullScreen]);

   return (
      <div
         className={`border-${
            theme.alpha
         } fixed bottom-0 w-full h-[90px] border-t  z-50 px-10
            ${
               isOpenFullScreen
                  ? "border-transparent bg-transparent"
                  : theme.bottom_player_bg
            }
            ${idle ? "hidden" : ""} `}
      >
         <div
            className={`flex flex-row gap-[10px] h-full items-stretch ${
               isOpenFullScreen ? "justify-center text-white" : "justify-between"
            }`}
         >
            <div className={`current-song w-1/3 ${isOpenFullScreen ? "hidden" : ""}`}>
               {/* song image, name and singer */}
               <div
                  className={`flex flex-row items-center h-full origin-center ${
                     isOpenFullScreen ? "hidden" : ""
                  }`}
               >
                  <div className="w-[2.5rem] h-[2.5rem]">
                     <img
                        className={`w-full object-cover object-center rounded-full`}
                        src={
                           songInStore.image_path
                              ? songInStore.image_path
                              : "https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                        }
                     />
                  </div>

                  <div className=" ml-[10px] flex-grow">
                     <div className="h-[24px] w-full">
                        {useMemo(
                           () => (
                              <ScrollText
                                 songInStore={songInStore}
                                 autoScroll
                                 classNames="text-[18px] font-[500]"
                                 label={songInStore?.name || "name"}
                              />
                           ),
                           [songInStore]
                        )}
                     </div>

                     <div className="h-[20px] w-full">
                        {useMemo(
                           () => (
                              <ScrollText
                                 songInStore={songInStore}
                                 autoScroll
                                 classNames="text-[14px] opacity-60"
                                 label={songInStore?.singer || "singer"}
                              />
                           ),
                           [songInStore]
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* control */}
            <div
               className={`desktop-bottom-player-control  flex  
               max-w-[400px] ${
                  isOpenFullScreen
                     ? "max-w-[600px] flex-col-reverse pb-[10px]"
                     : "flex-col justify-center"
               } flex-grow
            ${!songInStore.song_path ? "pointer-events-none opacity-20" : ""}`}
            >
               {useMemo(
                  () => (
                     <Control
                        audioEle={audioEle}
                        idle={false}
                        isPlaying={isPlaying}
                        isWaiting={isWaiting}
                        isOpenFullScreen={isOpenFullScreen}
                        setIsWaiting={setIsWaiting}
                        setIsPlaying={setIsPlaying}
                     />
                  ),
                  [isPlaying, isOpenFullScreen, isWaiting]
               )}
            </div>

            <div
               className={`volume-control w-1/3 flex items-center justify-end gap-5  ${
                  isOpenFullScreen ? "hidden" : ""
               }`}
            >
               <div className="flex items-center w-[150px]">
                  <button onClick={() => handleMute()}>
                     {isMute ? (
                        <SpeakerXMarkIcon className="w-6 h-6" />
                     ) : (
                        <SpeakerWaveIcon className="w-6 h-6" />
                     )}
                  </button>
                  <div
                     onClick={(e) => handleSetVolume(e)}
                     ref={volumeLine}
                     className={`ml-3 w-full relative h-[4px] hover:h-[0.4rem] cursor-pointer rounded-3xl overflow-hidden
                     ${theme.type === "light" ? "bg-gray-400" : "bg-gray-200"}
                     `}
                  >
                     <div
                        ref={volumeProcessLine}
                        className={`absolute left-0 top-0 h-full w-full ${theme.content_bg}`}
                     ></div>
                  </div>
               </div>

               <Button
                  onClick={() => setIsOpenFullScreen(true)}
                  variant={"circle"}
                  className={`h-[35px] w-[35px] p-[8px] ${
                     songInStore.name ? "" : "opacity-20 pointer-events-none"
                  }`}
               >
                  <ChevronUpIcon />
               </Button>

               {/* <Tooltip>
                  <TooltipTrigger></TooltipTrigger>
                  <TooltipContent>
                     <div
                        className={`bg-[#ccc] text-[#333] text-[14px] px-[10px] py-[2px] rounded-[4px]`}
                     >
                        Karaoke
                     </div>
                  </TooltipContent>
               </Tooltip> */}
            </div>
         </div>
      </div>
   );
}
