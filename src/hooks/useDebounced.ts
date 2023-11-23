import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store";
import appConfig from "../config/app";

export default function useDebounce(
   cb: () => void,
   restoreCb: () => void,
   isOpenFullScreen: boolean,
   delay: number
) {
   const timerId = useRef<NodeJS.Timeout>();
   const restoreTimerId = useRef<NodeJS.Timeout>();

   const { song: songInStore } = useSelector(selectAllSongStore);
   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);
   const [someThingToRun, setSomeThingToRun] = useState(0);

   // clear restore cb
   useEffect(() => {
      if (!isOpenFullScreen) return;

      return () => {
         if (restoreTimerId.current) clearTimeout(restoreTimerId.current);
      };
   }, [songInStore, isOpenFullScreen]);

   // prevent multiple click and run restore vb
   useEffect(() => {
      if (!someThingToTrigger) return;

      timerId.current = setTimeout(() => (timerId.current = undefined), delay);

      console.log('add restore timmer');
            
      restoreTimerId.current = setTimeout(() => {
         console.log("restore");
         restoreCb();
         window.dispatchEvent(new Event("mousemove"));
      }, 1000);
   }, [someThingToRun, appConfig]);

   // run cb,trigger prevent multiple click
   useEffect(() => {
      if (!timerId.current) {
         cb();
         console.log('set run');
         
         setSomeThingToRun(Math.random() * 10);
      }

      return () => {
         console.log("clear restore time out");

         clearTimeout(restoreTimerId.current);
      };
   }, [someThingToTrigger]);

   // trigger cb
   return () => setSomeThingToTrigger(Math.random() * 10);
}
