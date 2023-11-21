import { FC, useCallback, useEffect, useRef, useState } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGetSongLyric } from "../hooks";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store";

interface Props {
   audioEle: HTMLAudioElement;
   className: string;
   isOpenFullScreen:boolean
}

const LyricsList: FC<Props> = ({ audioEle, className, isOpenFullScreen,  }) => {

   const {song: songInStore} = useSelector(selectAllSongStore)

   // state
   const [currentTime, setCurrentTime] = useState<number>(0);
   const firstTimeRender = useRef(true);
   const scrollBehavior = useRef<ScrollBehavior>("instant");
   const containerRef = useRef<HTMLDivElement>(null);


   const { loading, songLyric } = useGetSongLyric({
      audioEle,
      isOpenFullScreen,
      songInStore,
    });

   const handleUpdateTime = useCallback(() => {
      setCurrentTime(audioEle.currentTime);
   }, []);

   const renderItem = () => {
      return songLyric.real_time.map((lyricItem, index) => {
         const bounce = 0.3;
         const inRange =
            currentTime >= lyricItem.start - bounce &&
            lyricItem.end > currentTime + bounce;
         return (
            <LyricItem
               firstTimeRender={firstTimeRender}
               scrollBehavior={scrollBehavior}
               key={index}
               done={!inRange && currentTime > lyricItem.end}
               active={inRange}
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
         setCurrentTime(0);
         firstTimeRender.current = true;

         const containerEle = containerRef.current as HTMLDivElement;

         if (containerEle) containerEle.scrollTop = 0;
         if (audioEle) audioEle.removeEventListener("timeupdate", handleUpdateTime);
      };
   }, []);   

   if (loading)
      return (
         <div className="mt-[30px] flex justify-center">
            <span>
               <ArrowPathIcon className="animate-spin w-[35px] duration-[2s]" />
            </span>
         </div>
      );

   if (!songLyric.real_time.length) {
      return;
   }

   return (
      <div
         ref={containerRef}
         className={`${
            className && className
         } overflow-y-auto overflow-x-hidden no-scrollbar pt-[30px] mask-image`}
      >
         {renderItem()}
      </div>
   );
};

export default LyricsList;
