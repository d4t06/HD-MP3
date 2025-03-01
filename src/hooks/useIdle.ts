import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { scrollToActiveSong } from "./useScrollSong";
import appConfig from "../config/app";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { usePlayerContext } from "@/stores/PlayerContext";

export default function useIdle(delay: number, isOnMobile: boolean) {
  // stores
  const { currentSongData } = useSelector(selectSongQueue);
  const { isOpenFullScreen, setIdle } = usePlayerContext();

  // state
  const [someThingToTrigger, setSomeThingToTriggerIdle] = useState(0);
  const timerIdFocus = useRef<NodeJS.Timeout>();
  const timerIdScrollSong = useRef<NodeJS.Timeout>();

  const handleMouseMove = () => {
    setIdle(false);
    setSomeThingToTriggerIdle(Math.random());
  };

  const clear = () => {
    clearTimeout(timerIdScrollSong.current);
    clearTimeout(timerIdFocus.current);
  };

  const handleIdle = async () => {
    if (!isOpenFullScreen) return;

    const activeSongEle = document.querySelector(".song-thumb.active");
    const containerEle = document.querySelector(".song-list-container");

    if (activeSongEle && containerEle) {
      const isScroll = scrollToActiveSong(
        activeSongEle as HTMLElement,
        containerEle as HTMLElement,
        true,
      );

      let timeToEnableFocus = appConfig.focusDelay;
      if (!isScroll) timeToEnableFocus = 0;

      timerIdFocus.current = setTimeout(() => {
        setIdle(true);
      }, timeToEnableFocus);
    }
  };

  useEffect(() => {
    if (isOnMobile || !currentSongData) return;

    if (!isOpenFullScreen) {
      setIdle(false);
      return;
    }

    setTimeout(() => {
      window.addEventListener("mousemove", handleMouseMove);

      window.dispatchEvent(new Event("mousemove"));
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clear();
    };
  }, [isOpenFullScreen]);

  useEffect(() => {
    timerIdScrollSong.current = setTimeout(() => {
      handleIdle();
    }, delay);

    return () => {
      clear();
    };
  }, [someThingToTrigger]);

  if (!isOpenFullScreen) return false;
}
