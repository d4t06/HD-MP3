import {
   Dispatch,
   FC,
   ForwardRefRenderFunction,
   MouseEvent,
   SetStateAction,
   forwardRef,
   useEffect,
   useRef,
   useState,
} from "react";
import {
   ArrowPathRoundedSquareIcon,
   ArrowTrendingUpIcon,
   BackwardIcon,
   ChevronUpIcon,
   ForwardIcon,
   PauseCircleIcon,
   PlayCircleIcon,
   SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { songs } from "../utils/songs";
import { Song } from "../types";
import useLocalStorage from "../hooks/useLocalStorage";
import handleTimeText from "../utils/handleTimeText";
import Button from "./ui/Button";

interface Props {
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
   isOpenFullScreen: boolean;
   idle: boolean;
   audioEle: HTMLAudioElement,
}

const BottomPlayer: FC<Props> = ({ isOpenFullScreen, setIsOpenFullScreen, idle, audioEle }) => {
   const SongStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();
   const { song: songInStore } = SongStore;

   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [duration, setDuration] = useState<number>();

   const [isRepeat, setIsRepeat] = useLocalStorage<boolean>("repeat", false);
   const [isShuffle, setIsShuffle] = useLocalStorage<boolean>("shuffle", false);

   const durationLineWidth = useRef<number>();
   const durationLine = useRef<HTMLDivElement>(null);
   const timeProcessLine = useRef<HTMLDivElement>(null);

   const volumeLineWidth = useRef<number>();
   const volumeLine = useRef<HTMLDivElement>(null);
   const volumeProcessLine = useRef<HTMLDivElement>(null);

   // const audioRef = useRef<HTMLAudioElement>(null);
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

   const handleSeek = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;

      if (durationLineWidth.current && duration) {
         // get boundingRect
         const clientRect = node.getBoundingClientRect();
         // get elements
         const timeProcessLineElement = timeProcessLine.current as HTMLElement;

         // calculating
         const length = e.clientX - clientRect.left;
         const lengthRatio = length / durationLineWidth.current;
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
      let newIndex = songInStore.currentIndex + 1;
      let newSong;
      if (newIndex < songs.length) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[0]
         newIndex = 0;
      }


      console.log("check new song, index", newSong, newIndex);

      dispatch(setSong({ ...newSong, currentIndex: newIndex }));
   };

   const handlePrevious = () => {
      let newIndex = songInStore.currentIndex - 1;
      let newSong;
      if (newIndex >= 0) {
         newSong = songs[newIndex];
      } else {
         newSong = songs[songs.length - 1]
         newIndex = songs.length - 1;
      }
      dispatch(setSong({ ...newSong, currentIndex: newIndex }));
   };

   const handleSetVolume = (
      e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
   ) => {
      const node = e.target as HTMLElement;
      const clientRect = node.getBoundingClientRect();

      if (volumeLineWidth.current) {
         let newVolume = (e.clientX - clientRect.x) / volumeLineWidth.current;

         if (newVolume > 0.9) newVolume = 1;
         if (newVolume < 0.1) newVolume = 0;

         if (volumeProcessLine.current && audioEle) {
            volumeProcessLine.current.style.width = newVolume * 100 + "%";
            audioEle.volume = newVolume;
         }
      }
   };

   // >>> behind the scenes handle
   const handlePlaying = () => {
      setIsPlaying(true);

      const currentTime = audioEle?.currentTime;
      const duration = audioEle?.duration;

      const timeProcessLineEle = timeProcessLine.current as HTMLElement;

      if (duration && currentTime) {
         const newWidth = currentTime / (duration / 100);

         timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
      }

      if (currentTimeRef.current) {
         currentTimeRef.current.innerText = handleTimeText(currentTime!);
      }
   };

   const handleEnded = () => {
      if (isRepeat) {
         return play();
      }
      if (isShuffle) {
         let randomIndex: number = songInStore.currentIndex;
         while (randomIndex === songInStore.currentIndex) {
            randomIndex = Math.floor(Math.random() * songs.length);
         }

         const newSong = getNewSong(randomIndex);
         return dispatch(setSong({ ...newSong, currentIndex: randomIndex }));
      }

      return handleNext();
   };

   const handleLoaded = () => {
      // get element
      // const audioElement = audioEle;


      // set duration
      setDuration(audioEle?.duration);

      // set duration base line width
      durationLineWidth.current = durationLine.current?.offsetWidth;
      volumeLineWidth.current = volumeLine.current?.offsetWidth;

      // add event listener
      audioEle?.addEventListener("pause", handlePause);
      audioEle?.addEventListener("timeupdate", handlePlaying);
      audioEle?.addEventListener("ended", handleEnded);

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
         audioEle?.removeEventListener("timeupdate", handlePlaying);
         audioEle?.removeEventListener("pause", handlePause);
         audioEle?.removeEventListener("ended", handleEnded);
      };
   }, [songInStore]);

   const buttonClasses = "w-6 h-6 hover:text-indigo-600";

   return (
      <div
         className={`fixed bottom-0 w-full h-[90px] 
      border-t z-50 text-white px-10 ${idle ? "hidden" : ""}`}
      >
         <div className={`flex flex-row justify-between h-full items-stretch`}>
            <div className="w-1/3">
               {songInStore.path && (
                  <div
                     className={`flex flex-row items-center h-full origin-center`}
                  >
                     <div className="w-[2.5rem] h-[2.5rem]">
                        <img
                           className={`w-full object-cover object-center rounded-full`}
                           src={songInStore?.image || "https://placehold.co/200x200"}
                        />
                     </div>

                     <div className="text-gray-100 ml-5">
                        <h5 className="text-lg mb overflow-hidden">
                           {songInStore?.name || "name"}
                        </h5>
                        <p className="text-sm opacity-80">
                           {songInStore?.singer || "singer"}
                        </p>
                     </div>
                  </div>
               )}
            </div>

            {/* control */}
            <div
               className={`flex flex-col max-w-[400px] flex-grow justify-center ${!songInStore.path ? "pointer-events-none opacity-60" : ""
                  }`}
            >
               {/* buttons */}
               <div
                  className={`w-full flex flex-row justify-center items-center gap-x-10 h-[40px]`}
               >
                  <button onClick={() => setIsRepeat(!isRepeat)}>
                     <ArrowPathRoundedSquareIcon
                        className={
                           buttonClasses + `${isRepeat ? " text-indigo-600" : ""}`
                        }
                     />
                  </button>
                  <button onClick={() => handlePrevious()}>
                     <BackwardIcon className={buttonClasses} />
                  </button>
                  <button onClick={() => handlePlayPause()}>
                     {isPlaying ? (
                        <PauseCircleIcon
                           className={"w-12 h-12 hover:text-indigo-600"}
                        />
                     ) : (
                        <PlayCircleIcon
                           className={"w-12 h-12 hover:text-indigo-600"}
                        />
                     )}
                  </button>
                  <button onClick={() => handleNext()}>
                     <ForwardIcon className={buttonClasses} />
                  </button>
                  <button onClick={() => setIsShuffle(!isShuffle)}>
                     <ArrowTrendingUpIcon
                        className={
                           buttonClasses + `${isShuffle ? " text-indigo-600" : ""}`
                        }
                     />
                  </button>
               </div>

               {/* process */}
               <div className="flex flex-row items-center h-[30px] gap-x-[5px]">
                  <div className="w-[43px]">
                     {audioEle && (
                        <span ref={currentTimeRef} className="text-gray-500">
                           00:00
                        </span>
                     )}
                  </div>
                  <div
                     ref={durationLine}
                     onClick={(e) => handleSeek(e)}
                     className="h-1 hover:h-[0.4rem] bg-gray-300 flex-1 relative cursor-pointer rounded-3xl overflow-hidden"
                  >
                     <div
                        ref={timeProcessLine}
                        className="absolute left-0 top-0 h-full bg-indigo-600"
                     ></div>
                  </div>
                  <div className="w-[33px]">
                     {audioEle && (
                        <span>{handleTimeText(audioEle?.duration!)}</span>
                     )}
                  </div>
               </div>
            </div>


            <div className={`w-1/3 flex items-center justify-end gap-5 `}>
               <div className="flex items-center flex-grow max-w-[150px]">
                  <button>
                     <SpeakerWaveIcon className="w-6 h-6" />
                  </button>
                  <div
                     onClick={(e) => handleSetVolume(e)}
                     ref={volumeLine}
                     className="ml-3 w-full  bg-gray-300 relative h-1 hover:h-[0.4rem] cursor-pointer rounded-3xl overflow-hidden"
                  >
                     <div
                        ref={volumeProcessLine}
                        className="absolute left-0 top-0 h-full w-1/2 bg-indigo-600"
                     ></div>
                  </div>
               </div>

               <Button
                  onClick={() => setIsOpenFullScreen(true)}
                  variant={"circle"}
                  className={`h-[35px] w-[35px] p-[8px] ${isOpenFullScreen ? 'opacity-0 pointer-events-none' : ''}`}
               >
                  <ChevronUpIcon />
               </Button>
            </div>
         </div>
      </div>
   );
};

export default BottomPlayer;
