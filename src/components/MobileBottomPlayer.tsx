import { Dispatch, FC, SetStateAction, useEffect } from "react";
import {
   ForwardIcon,
   PauseCircleIcon,
   PlayCircleIcon,
   TruckIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";
import { useSongs } from "../store/SongsContext";

interface Props {
   audioEle: HTMLAudioElement;
   idle: boolean;
   isOpenFullScreen: boolean;
   isPlaying: boolean;
   isWaiting: boolean;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
}

const MobileBottomPlayer: FC<Props> = ({
   audioEle,
   isOpenFullScreen,
   isWaiting,
   setIsOpenFullScreen,
   // idle,

   isPlaying,
}) => {
   const dispatch = useDispatch();
   const SongStore = useSelector(selectAllSongStore);

   const { songs } = useSongs();
   const { theme } = useTheme();
   const { song: songInStore } = SongStore;

   const play = () => {
      audioEle?.play();
   };
   const pause = () => {
      audioEle?.pause();
   };

   const handlePlayPause = () => {
      isPlaying ? pause() : play();
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
      dispatch(setSong({ ...newSong, currentIndex: newIndex }));
   };

   useEffect(() => {
      if (isOpenFullScreen) return;
      // audioEle?.addEventListener("pause", handlePause);
      // audioEle?.addEventListener("waiting", handleWaiting);
      // audioEle?.addEventListener("play", handlePlay);

      return () => {
         // audioEle?.removeEventListener("pause", handlePause);
         // audioEle?.removeEventListener("waiting", handleWaiting);
         // audioEle?.removeEventListener("play", handlePlay);

         // setIsWaiting(true);
      };
   }, [songInStore, isOpenFullScreen]);

   // console.log("check wating", isWaiting);
   

   return (
      <div
         className={`fixed bottom-0 w-full h-[70px] border-t z-40  px-[20px] ${theme.bottom_player_bg}`}
      >
         <div className={`flex flex-row  h-full`}>
            <div
               onClick={() => setIsOpenFullScreen(true)}
               className={`mobile-current-song flex-grow`}
            >
               {/* song image, name and singer */}
               <div className={` flex flex-row items-center flex-grow h-full`}>
                  <div className="w-[40px] h-[40px]">
                     <img
                        className={`w-full object-cover object-center rounded-full`}
                        src={
                           songInStore.image_path
                              ? songInStore.image_path
                              : "https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                        }
                     />
                  </div>

                  <div className="flex-grow  ml-[10px]">
                     {songInStore.song_path && (
                        <>
                           <h5 className="text-[18px] font-[500]">
                              {songInStore?.name || "name"}
                           </h5>
                           <p className={`text-[14px] font-[400] line-clamp-1`}>
                              {songInStore?.singer || "singer"}
                           </p>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div
               className={`mobile-bottom-player flex items-center h-full pl-[15px] gap-[10px] ${
                  !songInStore.name && "opacity-60 pointer-events-none"
               }`}
            >
               <button className="p-[4px]" onClick={() => handlePlayPause()}>
                  {isWaiting ? (
                     <TruckIcon className={"w-[35px]"} />
                  ) : isPlaying ? (
                     <PauseCircleIcon className="w-[35px]" />
                  ) : (
                     <PlayCircleIcon className="w-[35px]" />
                  )}
               </button>
               <button onClick={handleNext} className="p-[4px]">
                  <ForwardIcon className="w-[35px]" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default MobileBottomPlayer;
