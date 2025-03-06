import { usePlayerContext } from "@/stores";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function useCountDown() {
   const {audioRef, controlRef} = usePlayerContext()
   if (!audioRef.current) throw new Error("useCountDown audioRef.current is undefined")

  const { playStatus } = useSelector(selectAllPlayStatusStore);

  // stores user timer, decide add song event or not
  const [isActive, setIsActive] = useState(0);
  const [countDown, setCountDown] = useState(0); // count down

  const isEnd = useRef(false);

  const clearTimer = (clearCountDown?: boolean) => {
    setLocalStorage("timer", 0);
    setIsActive(0);
    isEnd.current = true;

    if (clearCountDown) setCountDown(0);
  };

  const handleSongEnd = () => {
    setCountDown((prev) => {
      if (prev - 1 > 0) {
        setLocalStorage("timer", prev - 1);
        return prev - 1;
      }

      clearTimer();
      return 0;
    });
  };

  // load localStorage
  useEffect(() => {
    const timer = getLocalStorage()["timer"] || 0;
    setIsActive(timer);
    setCountDown(timer);
  }, []);

  // add audio event
  useEffect(() => {
    if (!isActive) return;

    audioRef.current!.addEventListener("ended", handleSongEnd);

    return () => {
      audioRef.current!.removeEventListener("ended", handleSongEnd);
    };
  }, [isActive]);

  // handle user click
  useEffect(() => {
    /** loadLocalStorage:  loadStorage() => setActive(), setCountDown() */
    /** manual: user choose timer => setIsActive() => setCountDown() */
    if (!isActive) return;

    if (!countDown) {
      setCountDown(isActive);
      setLocalStorage("timer", isActive);

      if (playStatus === "paused") controlRef.current?.handlePlayPause();
    }
  }, [isActive]);

  return { countDown, clearTimer, setCountDown, setIsActive, isActive };
}
