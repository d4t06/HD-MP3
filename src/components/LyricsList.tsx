import { FC, useEffect, useRef, useState } from "react";
import { Lyric } from "../types";
import LyricItem from "./ui/LyricItem";
import { useTheme } from "../store/ThemeContext";

interface Props {
  audioEle: HTMLAudioElement;
  lyric: Lyric;
}

const LyricsList: FC<Props> = ({ audioEle, lyric }) => {
  const { theme } = useTheme();

  if (!lyric) {
    return <h1 className="text-3xl text-center">...</h1>;
  }

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
    return lyric.realtime.map((lyricItem, index) => {
      console.log("check lyric item", lyric);

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
  console.log("check lyric", lyric);

  return <ul className="">{renderItem()}</ul>;
};

export default LyricsList;
