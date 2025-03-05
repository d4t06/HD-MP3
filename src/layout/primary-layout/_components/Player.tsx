import { useEffect } from "react";

import {
  MobileFullScreenPlayer,
  MobileBottomPlayer,
} from "@/components";
import SongQueue from "@/components/SongQueue";
import useIdle from "@/hooks/useIdle";
import appConfig from "@/config/app";
import { useThemeContext } from "@/stores";
import PlayerContextProvider, { usePlayerContext } from "@/stores/PlayerContext";

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
