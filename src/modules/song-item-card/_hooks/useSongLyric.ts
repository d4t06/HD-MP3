import { useEffect, useRef, useState } from "react";
// import { useLyricContext, usePlayerContext } from "@/stores";

const LYRIC_TIME_BOUNDED = 0.3;

type Props = {
  lyrics: Lyric[];
  audioEle: HTMLAudioElement;
  isActive: boolean;
};

export default function useLyric({ audioEle, lyrics, isActive }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTimeRef = useRef(0);
  const currentIndexRef = useRef(0);

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
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }
  };

  //  add event listeners
  useEffect(() => {
    if (!isActive || !lyrics.length) return;
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [lyrics, isActive]);

  return {
    currentIndex,
  };
}
