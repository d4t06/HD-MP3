// import { useEffect } from "react";

import { useThemeContext } from "@/stores";
import { usePlayerContext } from "@/stores/PlayerContext";
import FullScreenPlayer from "@/modules/full-screen-player";
import SongQueue from "@/modules/song-queue";
import BottomPlayer from "@/modules/bottom-player";
import MobileFullScreenPlayer from "@/modules/mobile-full-screen-player";
import MobileBottomPlayer from "@/modules/mobile-bottom-player";
import PlayerEffect from "./PlayerEffect";
import { useEffect, useState } from "react";

export default function Player() {
  // stores
  const { isOnMobile } = useThemeContext();
  const { audioRef } = usePlayerContext();

  const [_hasAudio, setHasAudio] = useState(false);

  // useAuthContext(); // for update audioRef

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
    setHasAudio(true);
  }, []);

  return (
    <>
      <audio ref={audioRef} className="hidden" />

      {audioRef.current && (
        <PlayerEffect audioEle={audioRef.current}>
          {isOnMobile ? mobileContent : desktopContent}
        </PlayerEffect>
      )}
    </>
  );
}
