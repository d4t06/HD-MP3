import { MouseEvent, MutableRefObject, RefObject, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useVolume(volumeLineWidth: MutableRefObject<number | undefined>
   , volumeProcessLine: RefObject<HTMLDivElement>, audioEle: HTMLAudioElement) {
   const [isMute, setIsMute] = useState(false);
   const [volume, setVolume] = useLocalStorage("volume", 1);


   const handleSetVolume = (
      e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
   ) => {
      const node = e.target as HTMLElement;
      const clientRect = node.getBoundingClientRect();

      console.log('handleSetVolume');

      if (volumeLineWidth.current) {
         let newVolume = +(
            (e.clientX - clientRect.x) /
            volumeLineWidth.current
         ).toFixed(2);

         if (newVolume > 0.9) newVolume = 1;
         else if (newVolume < 0.1) {
            newVolume = 0;
            setIsMute(true);
         } else setIsMute(false);

         setVolume(newVolume);
      }
   };

   const handleMute = () => {
      if (audioEle.muted) {
         audioEle.muted = false;
         setIsMute(false);
      } else {
         audioEle.muted = true;
         setIsMute(true);
      }
   };

   useEffect(() => {
      if (volumeProcessLine.current && audioEle) {
         volumeProcessLine.current.style.width = volume * 100 + "%";
         audioEle.volume = volume;
      }
   }, [volume]);


   return { volume, handleSetVolume, isMute, handleMute }
}