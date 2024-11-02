import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { scrollToActiveSong } from "./useScrollSong";
import appConfig from "../config/app";
import { selectSongQueue } from "@/store/songQueueSlice";

export default function useIdle(
  delay: number,
  isOnMobile: boolean,
  isOpenFullScreen: boolean
) {
  // store
  const { currentSongData } = useSelector(selectSongQueue);

  // state
  const [idle, setIdle] = useState(false);
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

    const activeSongEle = document.querySelector(".song-thumb.active") as HTMLDivElement;
    const containerEle = document.querySelector(".song-list-container") as HTMLDivElement;

    if (activeSongEle && containerEle) {
      const isScroll = scrollToActiveSong(activeSongEle, containerEle, true);

      let timeToEnableFocus = appConfig.focusDelay;
      if (!isScroll) timeToEnableFocus = 0;

      timerIdFocus.current = setTimeout(() => {
        setIdle(true);
      }, timeToEnableFocus);
    }
  };

  useEffect(() => {
    if (!isOpenFullScreen) return;
    if (isOnMobile || !currentSongData) return;

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

  return idle;
}
