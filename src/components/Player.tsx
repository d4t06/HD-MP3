import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
   BottomPlayer,
   FullScreenPlayer,
   MobileFullScreenPlayer,
   MobileBottomPlayer,
} from "../components";
import { selectAllSongStore } from "../store/SongSlice";
import useIdle from "../hooks/useIdle";
import  appConfig from '../config/app'

interface PlayerProps {}

const Player: FC<PlayerProps> = () => {
   const songStore = useSelector(selectAllSongStore);

   const { song: songInStore } = songStore;
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isWaiting, setIsWaiting] = useState<boolean>(false);
   const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);

   const [isHasAudioEle, setIsHasAudioEle] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);
   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);
   // const idle = useIdle(appConfig.focusDelay, isOnMobile, isOpenFullScreen);

   const desktopContent = (
      <>
         <FullScreenPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <BottomPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false && isOpenFullScreen}
            isPlaying={isPlaying}
            isWaiting={isWaiting}
            isOpenFullScreen={isOpenFullScreen}
            setIsPlaying={setIsPlaying}
            setIsWaiting={setIsWaiting}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   const mobileContent = (
      <>
         <MobileFullScreenPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false}
            isPlaying={isPlaying}
            isWaiting={isWaiting}
            isOpenFullScreen={isOpenFullScreen}
            setIsPlaying={setIsPlaying}
            setIsWaiting={setIsWaiting}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <MobileBottomPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false && isOpenFullScreen}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            isWaiting={isWaiting}
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
