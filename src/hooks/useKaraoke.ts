import { useLyricContext } from "@/store/LyricContext";
import { ElementRef, RefObject, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  audioEle: HTMLAudioElement;
  lyricElementsRef: RefObject<ElementRef<"p">[]>;
};

// const showLyric = (ele: HTMLElement) => {
//   Object.assign(ele.style, { opacity: "1" });
// };

// const hideLyric = (ele: HTMLElement) => {
//   Object.assign(ele.style, { opacity: "0" });
// };

const LYRIC_TIME_BOUNDED = 0.3;

const isOdd = (n: number) => {
  return n % 2 !== 0;
};

export default function useKaraoke({ audioEle, lyricElementsRef }: Props) {
  const { songLyrics, loading } = useLyricContext();

  const [currentIndex, setCurrentIndex] = useState(0);

  const curerntIndexReft = useRef(0);
  // const oddText = useRef<ElementRef<"p">>(null);
  const oddOverlay = useRef<ElementRef<"p">>(null);

  // const eventText = useRef<ElementRef<"p">>(null);
  const evenOverlay = useRef<ElementRef<"p">>(null);

  const currentTimeRef = useRef(0);
  const currentIndexRef = useRef(0);

  const textData = useMemo(() => {
    if (!songLyrics.length) return { odd: "", even: "" };
    else
      return {
        odd: songLyrics[isOdd(currentIndex) ? currentIndex : currentIndex + 1].text,
        even: songLyrics[isOdd(currentIndex) ? currentIndex + 1 : currentIndex].text,
      };
  }, [currentIndex, songLyrics]);


  const handleAddAnimation = () => {
    if (isOdd(currentIndex)) {
      
    }
  }

  const handleTimeUpdate = () => {
    const direction =
      audioEle.currentTime > currentTimeRef.current ? "forward" : "backward";

    currentTimeRef.current = audioEle.currentTime;

    let nextIndex = currentIndexRef.current;

    switch (direction) {
      case "forward":
        while (
          nextIndex < songLyrics.length &&
          songLyrics[nextIndex + 1] &&
          songLyrics[nextIndex + 1].start - LYRIC_TIME_BOUNDED <
            currentTimeRef.current + LYRIC_TIME_BOUNDED
        ) {
          nextIndex += 1;
        }
        break;

      case "backward":
        while (
          nextIndex > 0 &&
          songLyrics[nextIndex - 1] &&
          songLyrics[nextIndex - 1].end - LYRIC_TIME_BOUNDED >
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

  useEffect(() => {
    if (!songLyrics.length) return;

    if (!lyricElementsRef.current) return;

    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.addEventListener("timeupdate", handleTimeUpdate);
    };
  }, [songLyrics]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;

    handleAddAnimation()

  }, [currentIndex]);

  return {
    loading,
    curerntIndexReft,
    oddOverlay,
    evenOverlay,
    currentIndex,
    textData,
  };
}
