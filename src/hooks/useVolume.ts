import { MouseEvent, RefObject, WheelEvent, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { useTheme } from "@/store";
import { getLinearBg } from "@/utils/getLinearBg";

type Props = {
  audioEle: HTMLAudioElement;
  volumeLineRef: RefObject<HTMLDivElement>;
};

export default function useVolume({ audioEle, volumeLineRef }: Props) {
  const { theme } = useTheme();

  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useLocalStorage("volume", 1);

  const handleSetVolume = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const node = e.target as HTMLElement;
    const clientRect = node.getBoundingClientRect();

    const volumeLineEle = volumeLineRef.current as HTMLDivElement;

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
    if (volumeLineRef.current && audioEle) {
      const ratio = volume * 100;

      volumeLineRef.current.style.background = getLinearBg(theme.content_code, ratio);
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
