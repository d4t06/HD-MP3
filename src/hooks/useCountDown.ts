import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function useCountDown({ audioEle }: Props) {
  const ranEffect = useRef(false);

  const {
    playStatus: { isPlaying },
  } = useSelector(selectAllPlayStatusStore);

  const [isActive, setIsActive] = useState(0);
  const [countDown, setCountDown] = useState(0);

  const timerId = useRef<NodeJS.Timeout>();

  const handleEndTimer = (clearCountDown?: boolean) => {
    //  setIsActive(0);
    //  dispatch(setPlayStatus({ isTimer: 0 }));
    setIsActive(0);

    setLocalStorage("timer", 0);
    clearInterval(timerId.current);
    if (clearCountDown) setCountDown(0);
  };

  //   the 2th render, isTimer has value but countdown no

  useEffect(() => {
    if (!ranEffect.current) return;

    console.log("check cd", countDown, isActive, isPlaying);
    if (!isActive) return;

    //  case user set sleep timer manually
    if (!countDown) {
      setCountDown(isActive);
      if (!isPlaying) {
        audioEle.play();
      }

      // case load countdown from localStorage
    } else if (!isPlaying) return;

    timerId.current = setInterval(
      () =>
        setCountDown((prev) => {
          if (prev === 1) {
            audioEle.pause();
            handleEndTimer();

            return 0;
          }

          if (prev === isActive || prev % 5 === 0) setLocalStorage("timer", prev - 1);

          return prev - 1;
        }),
      1000
    );

    return () => {
      clearInterval(timerId.current);
    };
  }, [isPlaying, isActive]);

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      const timer = getLocalStorage()["timer"] || 0;

      setCountDown(timer);
      setIsActive(timer);
      // dispatch(setPlayStatus({ isTimer: timer }));
    }
  }, []);

  return { countDown, isActive, handleEndTimer,setIsActive };
}
