import { FC, useEffect, useRef, useState } from "react";
import { Lyric } from "../types";
import LyricItem from "./child/LyricItem";
import { useTheme } from "../store/ThemeContext";

interface Props {
   audioEle: HTMLAudioElement;
   songLyric: Lyric;
   className?: string;
}

const LyricsList: FC<Props> = ({ audioEle, songLyric, className }) => {
   const { theme } = useTheme();

   const [currentTime, setCurrentTime] = useState<number>(0);
   const firstTimeRender = useRef(true);
   const containerRef = useRef<HTMLUListElement>(null);

   const handleUpdateTime = () => {
      setCurrentTime(audioEle.currentTime);
   };

   useEffect(() => {
      if (!firstTimeRender.current) return;
      if (!audioEle) return;

      audioEle.addEventListener("timeupdate", handleUpdateTime);

      if (currentTime) {
         if (firstTimeRender) firstTimeRender.current = false;
      }
   }, [currentTime]);

   // useEffect(() => {
   //    if (!songLyric.real_time.length) return;
   //    const node = containerRef.current as HTMLElement;
   //    if (node) {
   //       node.style.height = window.innerHeight - 125 + "px";
   //    }
   // }, []);

   const renderItem = () => {
      return songLyric.real_time.map((lyricItem, index) => {
         const inRange = currentTime >= lyricItem.start && lyricItem.end > currentTime;
         return (
            <LyricItem
               theme={theme}
               firstTimeRender={firstTimeRender.current}
               key={index}
               done={!inRange}
               active={inRange}
               className="mb-[30px]"
            >
               {lyricItem.text}
            </LyricItem>
         );
      });
   };

   if (!songLyric.real_time.length) {
      return <h1 className="text-[50px] mt-[30px] text-center">...</h1>;
   }

   return (
      <ul ref={containerRef} className={`${className && className} overflow-y-auto overflow-x-hidden no-scrollbar h-full max-h-[500px] pt-[30px] mask-image`}>
         {renderItem()}
      </ul>
   );
};

export default LyricsList;
