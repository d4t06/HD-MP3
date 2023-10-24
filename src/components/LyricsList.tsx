import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Lyric } from "../types";
import LyricItem from "./child/LyricItem";

interface Props {
   audioEle: HTMLAudioElement;
   songLyric: Lyric;
   className?: string;
}

const LyricsList: FC<Props> = ({ audioEle, songLyric, className }) => {

   const [currentTime, setCurrentTime] = useState<number>(0);
   const firstTimeRender = useRef(true);
   const scrollBehavior = useRef<ScrollBehavior>("instant");
   const containerRef = useRef<HTMLDivElement>(null);

   const handleUpdateTime = useCallback(() => {
      setCurrentTime(audioEle.currentTime);
   }, []);

   const renderItem = () => {
      return songLyric.real_time.map((lyricItem, index) => {
         const bounce = 0.3
         const inRange = currentTime >= lyricItem.start - bounce && lyricItem.end > currentTime + bounce ;
         return (
            <LyricItem
               firstTimeRender={firstTimeRender}
               scrollBehavior={scrollBehavior}
               containerRef={containerRef}
               key={index}
               done={!inRange && currentTime > lyricItem.end}
               active={inRange}
               currentTime={currentTime}
               className="mb-[30px]"
            >
               {lyricItem.text}
            </LyricItem>
         );
      });
   };

   useEffect(() => {
      if (!audioEle) return;

      if (!currentTime) {
         handleUpdateTime();
      }

      audioEle.addEventListener("timeupdate", handleUpdateTime);

      return () => {         
         setCurrentTime(0)
         firstTimeRender.current = true
         
         const containerEle = containerRef.current as HTMLDivElement

         if (containerEle) containerEle.scrollTop = 0
         if (audioEle) audioEle.removeEventListener("timeupdate", handleUpdateTime);
      };
   }, []);

   if (!songLyric.real_time.length) {
      return <h1 className="text-[50px] mt-[30px] text-center">...</h1>;
   }

   return (
      <div
         ref={containerRef}
         className={`${
            className && className
         } overflow-y-auto overflow-x-hidden no-scrollbar h-full pt-[30px] mask-image`}
      >
         {renderItem()}
      </div>
   );
};

export default LyricsList;
