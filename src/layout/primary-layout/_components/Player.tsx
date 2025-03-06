import { useEffect } from "react";

import appConfig from "@/config/app";
import { useThemeContext } from "@/stores";
import PlayerContextProvider, { usePlayerContext } from "@/stores/PlayerContext";
import FullScreenPlayer from "@/modules/full-screen-player";
import SongQueue from "@/modules/song-queue";
import BottomPlayer from "@/modules/bottom-player";
import MobileFullScreenPlayer from "@/modules/mobile-full-screen-player";
import MobileBottomPlayer from "@/modules/mobile-bottom-player";
import useIdle from "../_hooks/useIdle";

const PlayerContent = () => {
  // stores
  const { isOnMobile } = useThemeContext();
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
