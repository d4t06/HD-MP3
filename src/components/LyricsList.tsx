import { FC, useCallback, useEffect, useRef, useState } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGetSongLyric } from "../hooks";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store";

interface Props {
   audioEle: HTMLAudioElement;
   className: string;
   isOpenFullScreen: boolean;
   active: boolean;
}

const LyricsList: FC<Props> = ({ audioEle, className, isOpenFullScreen, active }) => {
   const { song: songInStore } = useSelector(selectAllSongStore);

   // state
   const [currentTime, setCurrentTime] = useState<number>(0);
   const scrollBehavior = useRef<ScrollBehavior>("instant");
   const containerRef = useRef<HTMLDivElement>(null);

   const { loading, songLyric } = useGetSongLyric({
      audioEle,
      isOpenFullScreen,
   });

   const handleUpdateTime = useCallback(() => {
      setCurrentTime(audioEle.currentTime);
   }, []);

   const renderItem = () => {
      return songLyric.real_time.map((lyricItem, index) => {
         const bounce = 0.3;
         // display lyric early
         // ex start: 10 - 2s
         //    end: 20 - 2s
         const inRange = currentTime >= lyricItem.start - bounce && currentTime < lyricItem.end - bounce;
         return (
            <LyricItem
               key={index}
               done={!inRange && currentTime > lyricItem.end - bounce}
               active={inRange}
               className={`${inRange ? "active" : ""} mb-[30px]`}
            >
               {lyricItem.text}
            </LyricItem>
         );
      });
   };

   useEffect(() => {
      if (!audioEle) return;

      audioEle.addEventListener("timeupdate", handleUpdateTime);

      return () => {
         if (audioEle) audioEle.removeEventListener("timeupdate", handleUpdateTime);
      };
   }, []);

   useEffect(() => {
      const activeLyric = document.querySelector(".active.lyric");
      if (activeLyric) {
         activeLyric.scrollIntoView({
            behavior: scrollBehavior.current,
            block: "center",
         });
      }
   }, [active]);

   const classes = {
      container: "overflow-y-auto overflow-x-hidden no-scrollbar pt-[30px] mask-image",
      loadingContainer: "flex justify-center items-center h-full w-full",
   };

   return (
      <div ref={containerRef} className={`${className && className} ${classes.container}`}>
         {loading && (
            <div className={classes.loadingContainer}>
               <span>
                  <ArrowPathIcon className="opacity-[.6] animate-spin w-[35px] duration-[2s]" />
               </span>
            </div>
         )}

         {!loading && (
            <>
               {songLyric.real_time.length ? (
                  renderItem()
               ) : (
                  <div className={classes.loadingContainer}>
                     <h1 className="text-[30px] opacity-60">...</h1>
                  </div>
               )}
            </>
         )}
      </div>
   );
};

export default LyricsList;
