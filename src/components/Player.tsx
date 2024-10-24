import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  BottomPlayer,
  FullScreenPlayer,
  MobileFullScreenPlayer,
  MobileBottomPlayer,
} from "@/components";
import SongQueue from "./SongQueue";
import useIdle from "../hooks/useIdle";
import appConfig from "../config/app";
import { selectCurrentSong } from "@/store/currentSongSlice";
import { useTheme } from "@/store";

const Player = ({ admin }: { admin?: boolean }) => {
  // store
  const { currentSong } = useSelector(selectCurrentSong);
  const { isOnMobile } = useTheme();

  // state
  const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);
  const [isOpenSongQueue, setIsOpenSongQueue] = useState<boolean>(false);
  const [_isHasAudioEle, setIsHasAudioEle] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const idle = useIdle(appConfig.focusDelay, isOnMobile, isOpenFullScreen);
  // const idle=false;

  const desktopContent = audioRef.current && (
    <>
      {!admin && (
        <FullScreenPlayer
          audioEle={audioRef.current}
          idle={idle}
          isOpenFullScreen={isOpenFullScreen}
          setIsOpenFullScreen={setIsOpenFullScreen}
        />
      )}

      <SongQueue
        isOpenSongQueue={isOpenSongQueue}
        setIsOpenSongQueue={setIsOpenSongQueue}
      />

      <BottomPlayer
        admin={admin}
        audioEle={audioRef.current}
        idle={idle && isOpenFullScreen}
        isOpenFullScreen={isOpenFullScreen}
        isOpenSongQueue={isOpenSongQueue}
        setIsOpenSongQueue={setIsOpenSongQueue}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />
    </>
  );

  const mobileContent = audioRef.current && (
    <>
      <MobileFullScreenPlayer
        audioEle={audioRef.current}
        isOpenFullScreen={isOpenFullScreen}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />

      <MobileBottomPlayer
        audioEle={audioRef.current}
        isOpenFullScreen={isOpenFullScreen}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />
    </>
  );

  useEffect(() => {
    if (audioRef.current) setIsHasAudioEle(true);
  }, []);

  console.log("player render");

  return (
    <div className="absolute">
      <audio ref={audioRef} src={currentSong?.song_url} className="hd-mp3 hidden"></audio>
      {audioRef.current && (isOnMobile ? mobileContent : desktopContent)}
    </div>
  );
};

export default Player;
