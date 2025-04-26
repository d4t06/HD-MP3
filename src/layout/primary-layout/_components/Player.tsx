// import { useEffect } from "react";

import { useAuthContext, useThemeContext } from "@/stores";
import { usePlayerContext } from "@/stores/PlayerContext";
import FullScreenPlayer from "@/modules/full-screen-player";
import SongQueue from "@/modules/song-queue";
import BottomPlayer from "@/modules/bottom-player";
import MobileFullScreenPlayer from "@/modules/mobile-full-screen-player";
import MobileBottomPlayer from "@/modules/mobile-bottom-player";
import PlayerEffect from "./PlayerEffect";

export default function Player() {
  // stores
  const { isOnMobile } = useThemeContext();
  const { audioRef } = usePlayerContext();

  useAuthContext(); // for update audioRef

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

  return (
    <>
      <audio ref={audioRef} className="hidden" />

      {audioRef.current && (
        <PlayerEffect>{isOnMobile ? mobileContent : desktopContent}</PlayerEffect>
      )}
    </>
  );
}
