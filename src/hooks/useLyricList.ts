import { ElementRef, useEffect, useRef, useState } from "react";
import { useGetSongLyric } from ".";
import { scrollIntoView } from "@/utils/appHelpers";

interface Props {
  audioEle: HTMLAudioElement;
  active: boolean;
}

const LYRIC_TIME_BOUNDED = 0.3;

export default function useLyricList({ active, audioEle }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollBehavior = useRef<ScrollBehavior>("instant");
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef(0);
  const lyricRefs = useRef<ElementRef<"div">[]>([]);
  const currentIndexRef = useRef(0);

  const { loading, songLyrics } = useGetSongLyric({
    audioEle,
    active,
  });

  const handleTimeUpdate = () => {
    const direction =
      audioEle.currentTime > currentTimeRef.current ? "forward" : "backward";

    currentTimeRef.current = audioEle.currentTime;

    let nextIndex = currentIndexRef.current;

    switch (direction) {
      case "forward":
        while (
          songLyrics[nextIndex + 1] &&
          songLyrics[nextIndex + 1].start - LYRIC_TIME_BOUNDED <
            currentTimeRef.current + LYRIC_TIME_BOUNDED
        ) {
          nextIndex += 1;
        }
        break;

      case "backward":
        while (
          songLyrics[nextIndex - 1] &&
          songLyrics[nextIndex - 1].end - LYRIC_TIME_BOUNDED >
            currentTimeRef.current + LYRIC_TIME_BOUNDED
        ) {
          nextIndex -= 1;
        }
        break;
    }

    if (nextIndex !== currentIndexRef.current) {
      if (Math.abs(nextIndex - currentIndexRef.current) > 5)
        scrollBehavior.current = "instant";

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      scrollIntoView(lyricRefs.current[nextIndex], scrollBehavior.current);

      if (scrollBehavior.current === "instant") scrollBehavior.current = "smooth";
    }
  };

  //  immediate scroll to active songs when change tab
  useEffect(() => {
    handleTimeUpdate();
  }, [active]);

  //  add event listeners
  useEffect(() => {
    if (!active || !songLyrics.length) return;
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [active, songLyrics]);

  //  reset when change song
  useEffect(() => {
    return () => {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    };
  }, [songLyrics]);

  return {
    songLyrics,
    loading,
    currentIndex,
    containerRef,
    lyricRefs,
    scrollBehavior,
  };
}
