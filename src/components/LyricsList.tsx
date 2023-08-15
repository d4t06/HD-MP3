import { FC, useEffect, useRef, useState } from "react";
import { Lyric } from "../types";
import LyricItem from "./ui/LyricItem";

interface Props {
   audioEle: HTMLAudioElement,
   lyrics: Lyric[];
}


const LyricsList: FC<Props> = ({ audioEle, lyrics }) => {
   const [currentTime, setCurrentTime] = useState<number>(0);
   const firstTimeRender = useRef(true)

   const handleUpdateTime = () => {
      setCurrentTime(audioEle.currentTime)
   }

   useEffect(() => {
      if (!firstTimeRender.current) return;
      if (!audioEle) return;

      console.log("check useEffect");
      
      audioEle.addEventListener("timeupdate", handleUpdateTime)

      if (currentTime) {
         if (firstTimeRender) firstTimeRender.current = false;
      }
   }, [currentTime])


   const renderItem = () => {
      return lyrics.map((lyric, index) => {

         const inRange = currentTime >= lyric.start && lyric.end > currentTime;
         return <LyricItem firstTimeRender={firstTimeRender.current} key={index} done={!inRange} active={inRange}>{lyric.text}</LyricItem>

      })
   }

   return <ul>

      {renderItem()}
   </ul>
}

export default LyricsList;