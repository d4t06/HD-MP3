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

  const textData = useMemo(() => {
    if (!songLyrics.length) return { odd: "", even: "" };
    else
      return {
        odd: songLyrics[isOdd(currentIndex) ? currentIndex : currentIndex + 1].text,
        even: songLyrics[isOdd(currentIndex) ? currentIndex + 1 : currentIndex].text,
      };
  }, [currentIndex, songLyrics]);

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;

    // if (!eventText.current || !oddText.current) return;

    // eventText.current.innerText = "asdsad";
    // oddText.current.innerText = "asdsad";
    if (Math.round(currentTime) % 5 === 0) setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (!songLyrics.length) return;

    if (!lyricElementsRef.current) return;

    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.addEventListener("timeupdate", handleTimeUpdate);
    };
  }, [songLyrics]);

  return {
    loading,
    curerntIndexReft,
    oddOverlay,
    evenOverlay,
    currentIndex,
    textData,
  };
}
