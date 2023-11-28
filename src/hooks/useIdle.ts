import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store";
import { scrollToActiveSong } from "./useScrollSong";
import appConfig from "../config/app";

export default function useIdle(delay: number, isOnMobile: boolean, isOpenFullScreen: boolean) {
   const { song: songInStore } = useSelector(selectAllSongStore);
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
         console.log("scroll");

         scrollToActiveSong(activeSongEle, containerEle, true);
         timerIdFocus.current = setTimeout(() => {
            setIdle(true);
         }, appConfig.focusDelay);
      }
   };

   useEffect(() => {
      if (!isOpenFullScreen) return;
      if (isOnMobile || !songInStore.id) return;

      setTimeout(() => {
         window.addEventListener("mousemove", handleMouseMove);
      }, 1000);

      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
         clear();
      };
   }, [isOpenFullScreen, songInStore]);

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
