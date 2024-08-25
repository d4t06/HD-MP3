import {
   Dispatch,
   SetStateAction,
   memo,
   useMemo,
   useRef,
} from "react";
import {
   SpeakerWaveIcon,
   SpeakerXMarkIcon,
   ChevronUpIcon,
   QueueListIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useTheme } from "../store/ThemeContext";
import { useLocation } from "react-router-dom";

import { Control } from ".";

import useVolume from "../hooks/useVolume";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import SongInfo from "./SongInfo";
import { selectCurrentSong } from "@/store/currentSongSlice";
interface Props {
   admin?: boolean;
   idle: boolean;
   audioEle: HTMLAudioElement;
   isOpenFullScreen: boolean;
   isOpenSongQueue: boolean;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
   setIsOpenSongQueue: Dispatch<SetStateAction<boolean>>;
}

function BottomPlayer({
   idle,
   audioEle,
   admin,

   isOpenFullScreen,
   setIsOpenFullScreen,

   isOpenSongQueue,
   setIsOpenSongQueue,
}: Props) {
   const { theme } = useTheme();
   const { currentSong } = useSelector(selectCurrentSong);
   const {
      playStatus: { isPlaying, isWaiting },
   } = useSelector(selectAllPlayStatusStore);

   // const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);

   // use hooks
   const location = useLocation();
   const { handleSetVolume, isMute, handleMute, handleWheel } = useVolume(
      // volumeLineWidth,
      volumeLine,
      audioEle
   );
   // const updateProcessLineWidth = () => {
   //    volumeLineWidth.current = volumeLine.current?.offsetWidth;
   // };

   // useWindowResize(updateProcessLineWidth, []);

   const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

   const handleOpenFullScreen = () => {
      if (isOpenSongQueue) setIsOpenSongQueue(false);
      setIsOpenFullScreen(true);
   };

   // update process lines width
   // useEffect(() => {
   //    volumeLineWidth.current = volumeLine.current?.offsetWidth;
   // }, [isOpenFullScreen]);

   const classes = {
      before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
      wrapper: `border-${
         theme.alpha
      } fixed bottom-0 w-full border-t transition-transform z-50 px-10 ${
         admin ? "h-[60px]" : "h-[90px]"
      }`,
      container: `flex flex-row gap-[10px] h-full items-stretch`,

      controlWrapper: `flex max-w-[450px] flex-grow`,
      controlWrapperChild_1: `${
         isOpenFullScreen
            ? "max-w-[600px] flex-col-reverse pb-[10px]"
            : "flex-col justify-center"
      }`,
      controlWrapperChild_2: `${
         !currentSong.song_url && "pointer-events-none opacity-60"
      }`,

      volumeWrapper: `volume-control ${
         admin ? "w-1/4" : "w-1/4 "
      } flex items-center justify-end gap-[8px]`,
      volumeLineBase: `ml-3 w-full relative h-[4px] cursor-pointer rounded-full`,
      volumeLineCurrent: `absolute left-0 top-0 h-full w-full `,

      blurBg: `bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] absolute inset-0 ${theme.bottom_player_bg}`,
   };

   return (
      <div
         className={`${classes.wrapper} ${
            isOpenFullScreen && "border-transparent"
         } ${inEdit && "translate-y-[100%] "} bg-transparent`}
      >
         <div
            className={`${classes.blurBg} ${
               isOpenFullScreen
                  ? "opacity-0 transition-opacity delay-[.2s]"
                  : ""
            }`}
         ></div>
         <div
            className={`${classes.container} ${
               isOpenFullScreen
                  ? "justify-center text-white"
                  : "justify-between"
            } ${idle && "transition-opacity duration-[.3s] opacity-0"}`}
         >
            <SongInfo isOpenFullScreen={isOpenFullScreen} admin={admin} />

            {/* control */}
            <div
               className={` ${classes.controlWrapper} ${
                  !admin ? classes.controlWrapperChild_1 : ""
               }  ${classes.controlWrapperChild_2}`}
            >
               {useMemo(
                  () => (
                     <Control
                        admin={admin}
                        audioEle={audioEle}
                        idle={false}
                        isOpenFullScreen={isOpenFullScreen}
                     />
                  ),
                  [isPlaying, isOpenFullScreen, isWaiting]
               )}
            </div>

            <div
               className={`${classes.volumeWrapper}  ${
                  isOpenFullScreen ? "hidden" : ""
               }`}
            >
               <div className="flex flex-grow items-center max-w-[150px]">
                  <button onClick={() => handleMute()}>
                     {isMute ? (
                        <SpeakerXMarkIcon className="w-[24px]" />
                     ) : (
                        <SpeakerWaveIcon className="w-[24px]" />
                     )}
                  </button>
                  <div
                     onClick={(e) => handleSetVolume(e)}
                     onWheel={handleWheel}
                     ref={volumeLine}
                     className={`${classes.volumeLineBase} ${classes.before}`}
                     style={{ backgroundColor: `white` }}
                  ></div>
               </div>

               {!admin && (
                  <>
                     <Tooltip placement="top">
                        <TooltipTrigger
                           onClick={handleOpenFullScreen}
                           className={`h-[35px] w-[35px] rounded-[99px] ${
                              theme.side_bar_bg
                           }  ${theme.content_hover_bg} p-[7px] ${
                              currentSong.name
                                 ? ""
                                 : "opacity-20 pointer-events-none"
                           }`}
                        >
                           <ChevronUpIcon className="w-full" />
                        </TooltipTrigger>

                        <TooltipContent>Fullscreen mode</TooltipContent>
                     </Tooltip>

                     <Tooltip placement="top">
                        <TooltipTrigger
                           onClick={() => setIsOpenSongQueue(!isOpenSongQueue)}
                           className={`${
                              theme.content_hover_bg
                           } h-[35px] w-[35px] p-[8px] rounded-[4px] ${
                              currentSong.name
                                 ? ""
                                 : "opacity-20 pointer-events-none"
                           } ${
                              isOpenSongQueue
                                 ? theme.content_bg
                                 : theme.side_bar_bg
                           }`}
                        >
                           <QueueListIcon className="w-full" />
                        </TooltipTrigger>

                        <TooltipContent>Queue</TooltipContent>
                     </Tooltip>
                  </>
               )}
            </div>
         </div>
      </div>
   );
}

export default memo(BottomPlayer);
