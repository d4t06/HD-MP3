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

type Props = {
  admin?: boolean;
};

const PlayerContent = ({ admin }: Props) => {
  // store
  const { isOnMobile } = useTheme();
  const { audioRef, setIsHasAudioEle, isOpenFullScreen } = usePlayerContext();

  const idle = useIdle(appConfig.focusDelay, isOnMobile);

  const desktopContent = audioRef.current && (
    <>
      {!admin && <FullScreenPlayer idle={idle && isOpenFullScreen} />}
      <SongQueue />
      <BottomPlayer admin={admin} idle={idle && isOpenFullScreen} />
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

export default function Player({ admin }: Props) {
  return (
    <PlayerContextProvider>
      <PlayerContent admin={admin} />
    </PlayerContextProvider>
  );
}
