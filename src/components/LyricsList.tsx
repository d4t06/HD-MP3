import { FC, useCallback, useEffect, useRef, useState } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGetSongLyric } from "../hooks";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "../store/PlayStatusSlice";
import { selectCurrentSong } from "@/store/currentSongSlice";

interface Props {
   audioEle: HTMLAudioElement;
   className: string;
   isOpenFullScreen: boolean;
   active: boolean;
}

const LyricsList: FC<Props> = ({ audioEle, className, isOpenFullScreen, active }) => {
   // state
   const {
      playStatus: { lyricSize },
   } = useSelector(selectAllPlayStatusStore);
   const [currentTime, setCurrentTime] = useState<number>(0);
   const scrollBehavior = useRef<ScrollBehavior>("instant");
   const containerRef = useRef<HTMLDivElement>(null);
   const { currentSong } = useSelector(selectCurrentSong);


   const prevTime = useRef(0);

   const { loading, songLyric } = useGetSongLyric({
      audioEle,
      isOpenFullScreen,
   });

   const handleUpdateTime = useCallback(() => {
      const currentTime = audioEle.currentTime;
      setCurrentTime(currentTime);

      // disable animation
      if (Math.abs(currentTime - prevTime.current) > 5) {
         scrollBehavior.current = "instant";
         prevTime.current = currentTime;
         return;
      }
      prevTime.current = currentTime;
   }, []);

   const lyricSizeMap = {
      small: "text-[20px] sm:text-[30px]",
      medium: "text-[25px] sm:text-[35px]",
      large: "text-[30px] sm:text-[40px]",
   };

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
               scrollBehavior={scrollBehavior}
               className={`${lyricSizeMap[lyricSize || "medium"]} ${inRange ? "active" : ""} mb-[30px]`}
            >
               {lyricItem.text}
            </LyricItem>
         );
      });
   };

   // add event listeners
   useEffect(() => {
      if (!audioEle) return;

      audioEle.addEventListener("timeupdate", handleUpdateTime);

      return () => {
         if (audioEle) audioEle.removeEventListener("timeupdate", handleUpdateTime);
      };
   }, []);

   // scroll to active lyric when change between lyric tab and others
   useEffect(() => {
      const activeLyric = document.querySelector(".active.lyric");
      if (activeLyric) {
         activeLyric.scrollIntoView({
            behavior: "instant",
            block: "center",
         });
      }
   }, [active]);

   // disable animation when first time load lyric
   useEffect(() => {
      if (scrollBehavior.current !== "instant") scrollBehavior.current = "instant";
   }, [currentSong]);

   const classes = {
      container: "overflow-y-auto overflow-x-hidden no-scrollbar pt-[30px] mask-image",
      loadingContainer: "flex justify-center items-center h-full w-full",
      loadingIcon: "opacity-[.6] animate-spin w-[35px] duration-[2s]",
   };

   return (
      <div ref={containerRef} className={`${className && className} ${classes.container}`}>
         {loading && (
            <div className={classes.loadingContainer}>
               <span>
                  <ArrowPathIcon className={classes.loadingIcon} />
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
