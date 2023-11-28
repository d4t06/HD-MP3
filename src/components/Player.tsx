import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
   BottomPlayer,
   FullScreenPlayer,
   MobileFullScreenPlayer,
   MobileBottomPlayer,
} from "../components";
import { selectAllSongStore } from "../store/SongSlice";
import SongQueue from "./SongQueue";
import useIdle from "../hooks/useIdle";
import appConfig from "../config/app";

const Player = ({ admin }: { admin?: boolean }) => {
   const songStore = useSelector(selectAllSongStore);

   const { song: songInStore } = songStore;
   const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);
   const [isOpenSongQueue, setIsOpenSongQueue] = useState<boolean>(false);

   const [isHasAudioEle, setIsHasAudioEle] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);
   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);

   const idle = useIdle(appConfig.scrollSongDelay, isOnMobile, isOpenFullScreen);

   const desktopContent = (
      <>
         {!admin && (
            <FullScreenPlayer
               audioEle={audioRef.current as HTMLAudioElement}
               idle={idle}
               isOpenFullScreen={isOpenFullScreen}
               setIsOpenFullScreen={setIsOpenFullScreen}
            />
         )}

         <SongQueue isOpenSongQueue={isOpenSongQueue} setIsOpenSongQueue={setIsOpenSongQueue} />

         <BottomPlayer
            admin={admin}
            audioEle={audioRef.current as HTMLAudioElement}
            idle={idle && isOpenFullScreen}
            isOpenFullScreen={isOpenFullScreen}
            isOpenSongQueue={isOpenSongQueue}
            setIsOpenSongQueue={setIsOpenSongQueue}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   const mobileContent = (
      <>
         <MobileFullScreenPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            isOpenFullScreen={isOpenFullScreen}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <MobileBottomPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={idle && isOpenFullScreen}
            isOpenFullScreen={isOpenFullScreen}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   useEffect(() => {
      if (isHasAudioEle) return;
      if (audioRef.current) setIsHasAudioEle(true);
   }, []);

   return (
      <div className="absolute">
         <audio ref={audioRef} src={songInStore.song_url} className="hidden"></audio>
         {isHasAudioEle ? (isOnMobile ? mobileContent : desktopContent) : ""}
      </div>
   );
};

export default Player;
