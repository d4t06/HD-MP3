import {
   Dispatch,
   FC,
   MouseEvent,
   SetStateAction,
   useEffect,
   useRef,
   useState,
} from "react";
import {
   ArrowPathIcon,
   ChevronUpIcon,
   ForwardIcon,
   PauseCircleIcon,
   PlayCircleIcon,
   SpeakerWaveIcon,
   SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
   selectAllSongStore,
   setSong,
} from "../store/SongSlice";
import { songs } from "../utils/songs";
import useLocalStorage from "../hooks/useLocalStorage";
import handleTimeText from "../utils/handleTimeText";
import Button from "./ui/Button";
import PlayerControl from "./ui/PlayerControl";

interface Props {
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
   isOpenFullScreen: boolean;
   idle: boolean;
   audioEle: HTMLAudioElement;
}

const BottomPlayer: FC<Props> = ({
   isOpenFullScreen,
   setIsOpenFullScreen,
   idle,
   audioEle,
}) => {
   const SongStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const { song: songInStore } = SongStore;

   const [isPlaying, setIsPlaying] =
      useState<boolean>(false);
   const [duration, setDuration] = useState<number>();

   const [isWaiting, setIsWaiting] =
      useState<boolean>(false);
   const [isMute, setIsMute] = useState(false);

   const [isRepeat, setIsRepeat] = useLocalStorage<boolean>(
      "repeat",
      false
   );
   const [isShuffle, setIsShuffle] =
      useLocalStorage<boolean>("shuffle", false);

   const durationLineWidth = useRef<number>();
   const durationLine = useRef<HTMLDivElement>(null);
   const timeProcessLine = useRef<HTMLDivElement>(null);

   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const volumeProcessLine = useRef<HTMLDivElement>(null);

   const currentTimeRef = useRef<HTMLDivElement>(null);

   const play = () => {
      audioEle?.play();
   };
   const pause = () => {
      audioEle?.pause();
   };

   const getNewSong = (index: number) => {
      return songs[index];
   };

   // >>> click handle
   const handlePlayPause = () => {
      isPlaying ? pause() : play();
   };

   const handlePause = () => {
      setIsPlaying(false);
   };

   const handleResetForNewSong = () => {
      const timeProcessLineElement =
         timeProcessLine.current as HTMLElement;

      if (
         timeProcessLineElement &&
         currentTimeRef.current
      ) {
         currentTimeRef.current.innerText = "00:00";
         timeProcessLineElement.style.width = "0%";
      }
   };

   const handleSeek = (
      e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
   ) => {
      const node = e.target as HTMLElement;

      if (durationLineWidth.current && duration) {
         // get boundingRect
         const clientRect = node.getBoundingClientRect();
         // get elements
         const timeProcessLineElement =
            timeProcessLine.current as HTMLElement;

         // calculating
         const length = e.clientX - clientRect.left;
         const lengthRatio =
            length / durationLineWidth.current;
         const newTime = lengthRatio * duration;

         if (audioEle && timeProcessLineElement) {
            // update current time
            audioEle.currentTime = +newTime.toFixed(1);
            // update process line width
            timeProcessLineElement.style.width =
               (lengthRatio * 100).toFixed(1) + "%";

            if (!isPlaying) play();
         }
      }
   };

   const handleNext = () => {
      let newIndex = songInStore.currentIndex! + 1;
      let newSong;
      if (newIndex < songs.length) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[0];
         newIndex = 0;
      }

      dispatch(
         setSong({ ...newSong, currentIndex: newIndex })
      );
   };

   const handlePrevious = () => {
      let newIndex = songInStore.currentIndex! - 1;
      let newSong;
      if (newIndex >= 0) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[songs.length - 1];
         newIndex = songs.length - 1;
      }

      dispatch(
         setSong({ ...newSong, currentIndex: newIndex })
      );
   };

   const handleSetVolume = (
      e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
   ) => {
      const node = e.target as HTMLElement;
      const clientRect = node.getBoundingClientRect();

      if (volumeLineWidth.current) {
         let newVolume =
            (e.clientX - clientRect.x) /
            volumeLineWidth.current;

         if (newVolume > 0.9) newVolume = 1;
         if (newVolume < 0.1) newVolume = 0;

         if (volumeProcessLine.current && audioEle) {
            volumeProcessLine.current.style.width =
               newVolume * 100 + "%";
            audioEle.volume = newVolume;
         }
      }
   };

   const handleMute = () => {
      if (audioEle.muted) {
         audioEle.muted = false;
         setIsMute(false);
      } else {
         audioEle.muted = true;
         setIsMute(true);
      }
   };

   // >>> behind the scenes handle
   const handlePlaying = () => {
      setIsPlaying(true);
      setIsWaiting(false);

      const currentTime = audioEle?.currentTime;
      const duration = audioEle?.duration;

      const timeProcessLineEle =
         timeProcessLine.current as HTMLElement;

      if (duration && currentTime) {
         const newWidth = currentTime / (duration / 100);

         timeProcessLineEle.style.width =
            newWidth.toFixed(1) + "%";
      }

      if (currentTimeRef.current) {
         currentTimeRef.current.innerText = handleTimeText(
            currentTime!
         );
      }
   };

   const handleWaiting = () => {
      setIsWaiting(true);
   };

   const handleEnded = () => {
      if (isRepeat) {
         console.log("song repeat");

         return play();
      }
      if (isShuffle) {
         let randomIndex: number = songInStore.currentIndex!;
         while (randomIndex === songInStore.currentIndex) {
            randomIndex = Math.floor(
               Math.random() * songs.length
            );
         }

         const newSong = getNewSong(randomIndex);
         return dispatch(
            setSong({
               ...newSong,
               currentIndex: randomIndex,
            })
         );
      }

      return handleNext();
   };

   const handleLoaded = () => {
      // get element
      // const audioElement = audioEle;

      // set duration
      setDuration(audioEle?.duration);

      // set duration base line width
      durationLineWidth.current =
         durationLine.current?.offsetWidth;
      volumeLineWidth.current =
         volumeLine.current?.offsetWidth;

      // add event listener
      audioEle?.addEventListener("pause", handlePause);
      audioEle?.addEventListener(
         "timeupdate",
         handlePlaying
      );
      audioEle?.addEventListener("ended", handleEnded);
      audioEle?.addEventListener("waiting", handleWaiting);

      // play song if click it
      play();
   };

   useEffect(() => {
      // console.log("check player ele", playerEle);

      if (!audioEle) return;
      const audioElement = audioEle;

      audioElement.onloadedmetadata = () => {
         handleLoaded();
      };

      return () => {
         audioEle?.removeEventListener(
            "timeupdate",
            handlePlaying
         );
         audioEle?.removeEventListener(
            "pause",
            handlePause
         );
         audioEle?.removeEventListener(
            "ended",
            handleEnded
         );
         audioEle?.removeEventListener(
            "waiting",
            handleWaiting
         );

         handleResetForNewSong();
      };
   }, [songInStore]);

   return (
      <div
         className={`fixed bottom-0 w-full h-[90px] z-50 text-white px-10 max-[549px]:px-[20px]
            ${isOpenFullScreen
               ? "max-[549px]:h-[150px]"
               : "border-t"
            }
            ${idle
               ? "hidden"
               : ""
            } `
         }
      >
         <div
            className={`flex flex-row justify-between h-full items-stretch`}
         >
            <div
               onClick={() => setIsOpenFullScreen(true)}
               className={`current-song w-1/3 "
               ${isOpenFullScreen
                     ? "max-[549px]:hidden"
                     : "max-[549px]:flex-grow"
                  }`}
            >
               <div
                  className={`flex flex-row items-center h-full origin-center`}
               >
                  <div className="w-[2.5rem] h-[2.5rem]">
                     <img
                        className={`w-full object-cover object-center rounded-full`}

                        src={songInStore.image
                           ? songInStore.image
                           : "https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"}
                     />
                  </div>

                  <div className="text-gray-100 ml-[10px]">
                     {songInStore.path &&
                        <>
                           <h5 className="text-xl mb overflow-hidden leading-[1]">
                              {songInStore?.name || "name"}
                           </h5>
                           <p className="text-md text-gray-400 leading-[1] mt-[5px]">
                              {songInStore?.singer || "singer"}
                           </p>
                        </>
                     }
                  </div>
               </div>
            </div>

            {/* control */}
            <div
               className={`desktop-bottom-player-control flex flex-col max-w-[400px] flex-grow justify-center max-[549px]:max-w-[100%]
            ${!songInStore.path
                     ? "pointer-events-none opacity-60"
                     : ""
                  }
            ${isOpenFullScreen
                     ? "max-[549px]:flex-col-reverse gap-[10px]"
                     : "max-[549px]:hidden"
                  }
            `}
            >
               <PlayerControl
                  audioEle={audioEle}
                  isWaiting={isWaiting}
                  isPlaying={isPlaying}

                  isRepeat={isRepeat}
                  setIsRepeat={setIsRepeat}
                  isShuffle={isShuffle}
                  setIsShuffle={setIsShuffle}

                  currentTimeRef={currentTimeRef}
                  timeProcessLine={timeProcessLine}
                  durationLine={durationLine}
                  handleNext={handleNext}
                  handlePrevious={handlePrevious}
                  handlePlayPause={handlePlayPause}
                  handleSeek={handleSeek}
               />
            </div>

            <div
               className={`volume-control w-1/3 flex items-center justify-end gap-5  max-[549px]:hidden`}
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
                     className="ml-3 w-full  bg-gray-300 relative h-1 hover:h-[0.4rem] cursor-pointer rounded-3xl overflow-hidden"
                  >
                     <div
                        ref={volumeProcessLine}
                        className="absolute left-0 top-0 h-full w-full bg-indigo-600"
                     ></div>
                  </div>
               </div>

               <Button
                  onClick={() => setIsOpenFullScreen(true)}
                  variant={"circle"}
                  className={`h-[35px] w-[35px] p-[8px] ${isOpenFullScreen
                     ? "opacity-0 pointer-events-none"
                     : ""
                     }`}
               >
                  <ChevronUpIcon />
               </Button>
            </div>

            <div
               className={`mobile-bottom-player items-center h-full pl-[15px] gap-[10px] hidden max- 
               ${!songInStore.path
                     ? "pointer-events-none opacity-60"
                     : ""
                  }
               ${isOpenFullScreen
                     ? ""
                     : "max-[549px]:flex"
                  }   
               `}
            >
               <button
                  className="w-10"
                  onClick={() => handlePlayPause()}
               >
                  {isWaiting ? (
                     <ArrowPathIcon
                        className={"animate-spin"}
                     />
                  ) : isPlaying ? (
                     <PauseCircleIcon className="" />
                  ) : (
                     <PlayCircleIcon className="" />
                  )}
               </button>
               <button className="w-10">
                  <ForwardIcon className="" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default BottomPlayer;
