import { useEffect, useRef, useState } from "react";

import {
  BottomPlayer,
  FullScreenPlayer,
  MobileFullScreenPlayer,
  MobileBottomPlayer,
} from "@/components";
import SongQueue from "./SongQueue";
import useIdle from "../hooks/useIdle";
import appConfig from "../config/app";
import { useTheme } from "@/store";
import { ControlRef } from "./Control";

const Player = ({ admin }: { admin?: boolean }) => {
  // store
  const { isOnMobile } = useTheme();

  // state
  const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);
  const [isOpenSongQueue, setIsOpenSongQueue] = useState<boolean>(false);
  const [_isHasAudioEle, setIsHasAudioEle] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const controlRef = useRef<ControlRef>(null);

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
        controlRef={controlRef}
        audioEle={audioRef.current}
        isOpenFullScreen={isOpenFullScreen}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />

      <MobileBottomPlayer
        controlRef={controlRef}
        isOpenFullScreen={isOpenFullScreen}
        setIsOpenFullScreen={setIsOpenFullScreen}
      />
    </>
  );

  useEffect(() => {
    if (audioRef.current) setIsHasAudioEle(true);
  }, []);

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      {audioRef.current && (isOnMobile ? mobileContent : desktopContent)}
    </>
  );
};

export default Player;
