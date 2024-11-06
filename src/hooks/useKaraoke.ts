import { useLyricContext } from "@/store/LyricContext";
import { selectCover } from "music-metadata";
import { ElementRef, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  audioEle: HTMLAudioElement;
};

const LYRIC_TIME_BOUNDED = 0.3;

const isOdd = (n: number) => {
  return n % 2 !== 0;
};

export default function useKaraoke({ audioEle }: Props) {
  const { songLyrics, loading } = useLyricContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const curerntIndexReft = useRef(0);

  const oddOverlay = useRef<ElementRef<"p">>(null); // const eventText = useRef<ElementRef<"p">>(null);
  const evenOverlay = useRef<ElementRef<"p">>(null);

  const currentTimeRef = useRef(0);
  const currentIndexRef = useRef(0);

  const textData = useMemo(() => {
    if (!songLyrics.length) return { odd: "", even: "" };
    else {
      const _isOdd = isOdd(currentIndex);
      if (!songLyrics[currentIndex + 1]) return { odd: "", even: "" };

      return {
        odd: songLyrics[_isOdd ? currentIndex : currentIndex + 1].text,
        even: songLyrics[_isOdd ? currentIndex + 1 : currentIndex].text,
      };
    }
  }, [currentIndex, songLyrics]);

  const clearAnimation = (overlay: ElementRef<"p">) => {
    overlay.style.animation = `none`;
  };

  const applyAnimation = (
    lyric: RealTimeLyric,
    overlay: ElementRef<"p">,
    past: number
  ) => {
    const style = document.querySelector("style");

    if (!style) return;

    style.innerText = `@keyframes lyric{0%{width:0%}25%{width:25%}50%{width:50%}75%{width:75%}100%{width:100%}}`;

    overlay.style.animation = `lyric ${lyric.end - lyric.start}s linear`;

    if (past > 0.2) {
      overlay.style.animationDelay = `-${past}s`;
    }
  };

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

      if (!oddOverlay.current || !evenOverlay.current) return;

      const _isOdd = isOdd(nextIndex);

      const nextLyric = songLyrics[nextIndex];

      const past = currentTimeRef.current - nextLyric.start + 0.3;

      applyAnimation(
        nextLyric,
        _isOdd ? oddOverlay.current : evenOverlay.current,
        past > 0 ? Math.abs(past) : 0
      );

      clearAnimation(_isOdd ? evenOverlay.current : oddOverlay.current);
    }
  };

  useEffect(() => {
    if (!songLyrics.length) return;
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);

      currentTimeRef.current = 0;
      currentIndexRef.current = 0;
    };
  }, [songLyrics]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
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
