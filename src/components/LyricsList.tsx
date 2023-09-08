import { FC, useEffect, useRef, useState } from "react";
import { Lyric } from "../types";
import LyricItem from "./ui/LyricItem";
import { useTheme } from "../store/ThemeContext";

interface Props {
  audioEle: HTMLAudioElement;
  songLyric: Lyric;
  className?: string,
}

const LyricsList: FC<Props> = ({ audioEle, songLyric, className }) => {
  const { theme } = useTheme();

 

  const [currentTime, setCurrentTime] = useState<number>(0);
  const firstTimeRender = useRef(true);

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
        >
          {lyricItem.text}
        </LyricItem>
      );
    });
  };
  // console.log("check lyric", songLyric);

  if (!songLyric.real_time.length) {
    return <h1 className="text-[50px] mt-[30px] text-center">...</h1>;
  }

  return <ul className={className}>{renderItem()}</ul>;
};

export default LyricsList;
