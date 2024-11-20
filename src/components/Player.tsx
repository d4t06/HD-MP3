import { useEffect } from "react";

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
import PlayerContextProvider, { usePlayerContext } from "@/store/PlayerContext";

const PlayerContent = () => {
  // store
  const { isOnMobile } = useTheme();
  const { audioRef, setIsHasAudioEle } = usePlayerContext();

  useIdle(appConfig.focusDelay, isOnMobile);

  const desktopContent = audioRef.current && (
    <>
      <FullScreenPlayer />
      <SongQueue />
      <BottomPlayer />
    </>
  );

  const mobileContent = audioRef.current && (
    <>
      <MobileFullScreenPlayer />
      <MobileBottomPlayer />
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

export default function Player() {
  return (
    <PlayerContextProvider>
      <PlayerContent />
    </PlayerContextProvider>
  );
}
