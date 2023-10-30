import { useRef, useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { selectAllSongStore } from "../store";
// import appConfig from "../config/app";

export default function useDebounce(
   cb: () => void,
   _restoreCb:() => void,
   delay: number
) {
   const timerId = useRef<NodeJS.Timeout>();
   // const restoreTimerId = useRef<NodeJS.Timeout>();

   // const { song: songInStore } = useSelector(selectAllSongStore);
   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);
   const [someThingToRun, setSomeThingToRun] = useState(0);

   // clear restore cb
   // useEffect(() => {
   //    console.log(songInStore.name);
      
   //    return () => {
   //       console.log("song instore change");
   //       clearTimeout(restoreTimerId.current);
   //    };
   // }, [songInStore]);

   // prevent multiple click and run restore vb
   useEffect(() => {
      if (!someThingToTrigger) return;

      timerId.current = setTimeout(() => (timerId.current = undefined), delay);

      // restoreTimerId.current = setTimeout(() => {
      //    console.log("restore");
      //    restoreCb();
      //    window.dispatchEvent(new Event("mousemove"));
      // }, appConfig.scrollSongDelay);

      return () => {
         // setSomeThingToTrigger(0);
         // clearTimeout(restoreTimerId.current);
      };
   }, [someThingToRun]);

   // run cb,trigger prevent multiple click
   useEffect(() => {
      if (!timerId.current) {
         cb();
         setSomeThingToRun(Math.random());
      }
   }, [someThingToTrigger]);

   // trigger cb
   return () => setSomeThingToTrigger(Math.random());
}
