import { FC, useEffect, useMemo, useRef, useState } from "react";

import BottomPlayer from "./BottomPlayer";
import FullScreenPlayer from "./FullScreenPlayer";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import MobileFullScreenPlayer from "./MobileFullScreenPlayer";
import MobileBottomPlayer from "./MobileBottomPlayer";

interface Props {}

const Player: FC<Props> = () => {
   const songStore = useSelector(selectAllSongStore);

   const { song: songInStore } = songStore;
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);

   const [ishasAudioEle, setIsHasAudioEle] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);
   const windowWidth = useRef<number>(window.innerWidth);

   // console.log("check render");

   const desktopContent = (
      <>
         <FullScreenPlayer
            idle={false}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            audioEle={audioRef.current as HTMLAudioElement}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <BottomPlayer
            idle={false && isOpenFullScreen}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            audioEle={audioRef.current as HTMLAudioElement}
            setIsPlaying={setIsPlaying}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   const mobileContent = (
      <>
         <MobileFullScreenPlayer
            idle={false}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            audioEle={audioRef.current as HTMLAudioElement}
            setIsOpenFullScreen={setIsOpenFullScreen}
            setIsPlaying={setIsPlaying}
         />

         <MobileBottomPlayer
            idle={false && isOpenFullScreen}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            audioEle={audioRef.current as HTMLAudioElement}
            setIsPlaying={setIsPlaying}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   useEffect(() => {
      if (ishasAudioEle) return;
      if (audioRef.current) setIsHasAudioEle(true);
   }, []);

   // console.log("check has audio", ishasAudioEle);

   // console.log("player render");

   return (
      <div className="absolute">
         <audio
            ref={audioRef}
            src={songInStore.song_path}
            className="hidden"
         ></audio>
         {ishasAudioEle
            ? windowWidth.current >= 550
               ? desktopContent
               : mobileContent
            : ""}
      </div>
   );
};

export default Player;
