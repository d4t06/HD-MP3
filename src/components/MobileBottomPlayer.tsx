import { Dispatch, FC, SetStateAction, useMemo } from "react";
import {
   ArrowPathIcon,
   ExclamationCircleIcon,
   ForwardIcon,
   PauseCircleIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/outline";
import siteLogo from "../assets/siteLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";
import { useSongsStore } from "../store/SongsContext";
import { Image } from ".";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";
import { useLocation } from "react-router-dom";

interface Props {
   audioEle: HTMLAudioElement;
   idle: boolean;
   isOpenFullScreen: boolean;
   setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
}

const MobileBottomPlayer: FC<Props> = ({
   audioEle,
   setIsOpenFullScreen,
   isOpenFullScreen,
}) => {
   const dispatch = useDispatch();
   const SongStore = useSelector(selectAllSongStore);
   const {
      playStatus: { isPlaying, isError, isWaiting },
   } = useSelector(selectAllPlayStatusStore);

   const { userSongs } = useSongsStore();
   const { theme } = useTheme();
   const { song: songInStore } = SongStore;

   const location = useLocation();
   const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);


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
      if (newIndex < userSongs.length) {
         newSong = userSongs[newIndex];
      } else {
         newSong = userSongs[0];
         newIndex = 0;
      }
      dispatch(
         setSong({ ...newSong, currentIndex: newIndex, song_in: songInStore.song_in })
      );
   };

   const renderIcon = useMemo(() => {
      if (isWaiting) {
         return <ArrowPathIcon className={"w-[36px] animate-spin"} />;
      } else if (isError && songInStore.name) {
         return <ExclamationCircleIcon className="w-[36px] " />;
      }

      return isPlaying ? (
         <PauseCircleIcon className={"w-[36px] "} />
      ) : (
         <PlayCircleIcon className={"w-[36px]"} />
      );
   }, [isWaiting, isError, isPlaying]);

   const classes = {
      wrapper: `fixed bottom-0 transition-transform w-full h-[70px] border-t border-${theme.alpha} z-40  px-[20px]`,
      container: `absolute inset-0 ${theme.bottom_player_bg} bg-opacity-[0.7] backdrop-blur-[15px] z-[-1]`,
      songImageWrapper: `flex flex-row items-center flex-grow h-full`,
      image: `w-[40px] h-[40px] flex-shrink-0`,
      cta: `mobile-bottom-player flex items-center h-full pl-[15px] gap-[10px]`,
   };

   return (
      <div className={`${classes.wrapper} ${inEdit ? 'translate-y-full' : ''}`}>
         <div
            className={`${classes.container} ${
               isOpenFullScreen ? "opacity-0 transition-opacity delay-[.3s]" : ""
            }`}
         ></div>

         <div className={`flex flex-row  h-full`}>
            <div
               onClick={() => setIsOpenFullScreen(true)}
               className={`mobile-current-song flex-grow`}
            >
               {/* song image, name and singer */}
               <div className={classes.songImageWrapper}>
                  <div className={classes.image}>
                     <Image
                        src={songInStore.image_url || siteLogo}
                        classNames="rounded-full"
                     />
                  </div>

                  <div className="flex-grow  ml-[10px]">
                     {songInStore.song_url && (
                        <>
                           <h5 className="text-[18px] font-[500] line-clamp-1">
                              {songInStore?.name || "name"}
                           </h5>
                           <p
                              className={`text-[14px] font-[400] opacity-60 line-clamp-1`}
                           >
                              {songInStore?.singer || "singer"}
                           </p>
                        </>
                     )}
                  </div>
               </div>
            </div>

            {/* cta */}
            <div
               className={`${classes.cta} ${
                  !songInStore.name && "opacity-60 pointer-events-none"
               }`}
            >
               <button className={` p-[4px]`} onClick={() => handlePlayPause()}>
                  {renderIcon}
               </button>
               <button onClick={handleNext} className={` p-[4px]`}>
                  <ForwardIcon className="w-[35px]" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default MobileBottomPlayer;
