import { useLyricContext } from "@/store/LyricContext";
import createKeyFrame from "@/utils/createKeyFrame";
import { getWidthList } from "@/utils/getWidthList";
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

  const tempEventText = useRef<ElementRef<"div">>(null);
  const tempOddText = useRef<ElementRef<"div">>(null);

  const currentTimeRef = useRef(0);
  const currentIndexRef = useRef(0);

  const textData = useMemo(() => {
    if (!songLyrics.length) return { odd: "", even: "" };
    else {
      const _isOdd = isOdd(currentIndex);
      if (!songLyrics[currentIndex + 1]) return { odd: "", even: "" };

      return {
        odd: songLyrics[_isOdd ? currentIndex : currentIndex + 1].text.trim(),
        even: songLyrics[_isOdd ? currentIndex + 1 : currentIndex].text.trim(),
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
    overlay.style.animation = `lyric ${
      (lyric?.tune?.end || lyric.end) - lyric.start
    }s linear forwards`;

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

      if (
        !oddOverlay.current ||
        !evenOverlay.current ||
        !tempOddText.current ||
        !tempEventText.current
      )
        return;

      const _isOdd = isOdd(nextIndex);

      const nextLyric = songLyrics[nextIndex];

      const past =
        currentTimeRef.current - (nextLyric?.tune ? nextLyric.tune.end : nextLyric.end);

      const widthList = getWidthList(
        _isOdd ? tempOddText.current : tempEventText.current
      );

      createKeyFrame(
        nextLyric.tune ? nextLyric.tune.grow.split("_").map((v) => +v) : [],
        widthList
      );

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
    tempEventText,
    tempOddText,
  };
}
