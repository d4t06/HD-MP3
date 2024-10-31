import { ControlRef } from "@/components/Control";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { RefObject, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  controlRef: RefObject<ControlRef>;
  audioEle: HTMLAudioElement;
};

export default function useCountDown({ controlRef, audioEle }: Props) {
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  // store user timer, decide add song event or not
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

    audioEle.addEventListener("ended", handleSongEnd);

    return () => {
      audioEle.removeEventListener("ended", handleSongEnd);
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
