import { ElementRef, useEffect, useRef, useState } from "react";
import { scrollIntoView } from "@/utils/appHelpers";
// import { useLyricContext, usePlayerContext } from "@/stores";

const LYRIC_TIME_BOUNDED = 0.3;

type Props = {
  lyrics: Lyric[];
  audioEle: HTMLAudioElement;
  isActive: boolean;
};

export default function useLyric({ audioEle, lyrics, isActive }: Props) {
  // const { songLyrics, loading } = useLyricContext();
  // const { audioRef, isOpenFullScreen, activeTab } = usePlayerContext();
  // if (!audioRef.current) throw new Error("useLyric !audioRef.current");

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollBehavior = useRef<ScrollBehavior>("instant");
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef(0);
  const lyricRefs = useRef<ElementRef<"div">[]>([]);
  const currentIndexRef = useRef(0);

  // const isOpenLyricTab = useMemo(
  //   () => isOpenFullScreen && activeTab === "Lyric",
  //   [isOpenFullScreen, activeTab],
  // );

  const handleTimeUpdate = () => {
    const direction =
      audioEle.currentTime > currentTimeRef.current ? "forward" : "backward";

    currentTimeRef.current = audioEle.currentTime;

    let nextIndex = currentIndexRef.current;

    switch (direction) {
      case "forward":
        while (
          lyrics[nextIndex + 1] &&
          lyrics[nextIndex + 1].start - LYRIC_TIME_BOUNDED <
            currentTimeRef.current + LYRIC_TIME_BOUNDED
        ) {
          nextIndex += 1;
        }
        break;

      case "backward":
        while (
          lyrics[nextIndex - 1] &&
          lyrics[nextIndex - 1].end - LYRIC_TIME_BOUNDED >
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

  const reset = () => {
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    currentTimeRef.current = 0;
  };

  //  immediate scroll to active songs when change tab
  useEffect(() => {
    if (isActive) handleTimeUpdate();

    return () => {
      if (!isActive) reset();
    };
  }, [isActive]);

  //  add event listeners
  useEffect(() => {
    if (!isActive || !lyrics.length) return;
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [lyrics, isActive]);

  //  reset when change song
  useEffect(() => {
    return () => {
      reset();
    };
  }, [lyrics]);

  return {
    currentIndex,
    containerRef,
    lyricRefs,
    scrollBehavior,
  };
}
