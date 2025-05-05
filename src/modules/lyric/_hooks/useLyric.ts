import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { scrollIntoView } from "@/utils/appHelpers";
import { useLyricContext, usePlayerContext } from "@/stores";

const LYRIC_TIME_BOUNDED = 0.3;

export default function useLyric() {
  const { songLyrics, loading } = useLyricContext();
  const { audioRef, isOpenFullScreen, activeTab } = usePlayerContext();
  if (!audioRef.current) throw new Error("useLyric !audioRef.current");

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollBehavior = useRef<ScrollBehavior>("instant");
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef(0);
  const lyricRefs = useRef<ElementRef<"div">[]>([]);
  const currentIndexRef = useRef(0);

  const isOpenLyricTab = useMemo(
    () => isOpenFullScreen && activeTab === "Lyric",
    [isOpenFullScreen, activeTab],
  );

  const handleTimeUpdate = () => {
    const direction =
      audioRef.current!.currentTime > currentTimeRef.current ? "forward" : "backward";

    currentTimeRef.current = audioRef.current!.currentTime;

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
  }, [isOpenLyricTab]);

  //  add event listeners
  useEffect(() => {
    if (!isOpenLyricTab || !songLyrics.length) return;
    audioRef.current!.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current!.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isOpenLyricTab, songLyrics]);

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
