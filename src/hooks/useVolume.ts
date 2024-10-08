import { MouseEvent, RefObject, WheelEvent, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { useTheme } from "@/store";

export default function useVolume(
  volumeLine: RefObject<HTMLDivElement>,
  audioEle: HTMLAudioElement
) {
  const { theme } = useTheme();

  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useLocalStorage("volume", 1);

  const handleSetVolume = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const node = e.target as HTMLElement;
    const clientRect = node.getBoundingClientRect();

    const volumeLineEle = volumeLine.current as HTMLDivElement;

    if (volumeLineEle) {
      let newVolume = +((e.clientX - clientRect.x) / volumeLineEle.clientWidth).toFixed(
        2
      );

      if (newVolume > 0.9) newVolume = 1;
      else if (newVolume < 0.05) {
        newVolume = 0;
        setIsMute(true);
      } else setIsMute(false);

      setVolume(newVolume);
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const FACTOR = 0.1;
    let newVolume = volume;

    // scroll down
    if (e.deltaY > 0) {
      if (newVolume - FACTOR > 0) newVolume -= FACTOR;
      else {
        newVolume = 0;
      }
    } else {
      if (newVolume + FACTOR < 1) newVolume += FACTOR;
      else {
        newVolume = 1;
      }
    }

    setVolume(+newVolume.toFixed(2));
  };

  const handleMute = () => setIsMute(!isMute);

  useEffect(() => {
    if (volumeLine.current && audioEle) {
      const ratio = volume * 100;

      volumeLine.current.style.background = `linear-gradient(to right, ${theme.content_code} ${ratio}%, #e1e1e1 ${ratio}%, #e1e1e1 100%)`;

      audioEle.volume = volume;

      if (volume === 0) setIsMute(true);
      else setIsMute(false);
    }
  }, [volume, theme]);

  useEffect(() => {
    if (!audioEle) return;
    audioEle.muted = isMute;
  }, [isMute]);

  return { volume, handleSetVolume, isMute, handleMute, handleWheel };
}
