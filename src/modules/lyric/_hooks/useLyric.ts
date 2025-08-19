import { ElementRef, useEffect, useRef, useState } from "react";
import { scrollIntoView } from "@/utils/appHelpers";

const LYRIC_TIME_BOUNDED = 0.3;

type Props = {
  lyrics: Lyric[];
  audioEle: HTMLAudioElement;
  isActive: boolean;
  noReset?: boolean;
  bounded?: number;
};

export default function useLyric({
  audioEle,
  lyrics,
  isActive,
  noReset = false,
  bounded,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollBehavior = useRef<ScrollBehavior>("instant");
  const currentTimeRef = useRef(0);
  const lyricRefs = useRef<ElementRef<"div">[]>([]);
  const currentIndexRef = useRef(0);

  const handleTimeUpdate = () => {
    if (lyricRefs.current[0] === null) return;

    const direction =
      audioEle.currentTime > currentTimeRef.current ? "forward" : "backward";

    currentTimeRef.current = audioEle.currentTime;

    let nextIndex = currentIndexRef.current;

    const _bounded = bounded || LYRIC_TIME_BOUNDED;

    switch (direction) {
      case "forward":
        while (
          lyrics[nextIndex + 1] &&
          lyrics[nextIndex + 1].start - _bounded <
            currentTimeRef.current + _bounded
        ) {
          nextIndex += 1;
        }
        break;

      case "backward":
        while (
          lyrics[nextIndex - 1] &&
          lyrics[nextIndex - 1].end - _bounded >
            currentTimeRef.current + _bounded
        ) {
          nextIndex -= 1;
        }
        break;
    }

    /*
    when song change, the current time reset to 0 immediate
    before the lyrics full displed which cause ele not found error
    */

    if (nextIndex !== currentIndexRef.current) {
      if (Math.abs(nextIndex - currentIndexRef.current) > 5)
        scrollBehavior.current = "instant";

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      if (!!lyricRefs.current[nextIndex])
        scrollIntoView(lyricRefs.current[nextIndex], scrollBehavior.current);

      if (scrollBehavior.current === "instant")
        scrollBehavior.current = "smooth";
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
      if (!noReset) reset();
    };
  }, [lyrics]);

  return {
    currentIndex,
    lyricRefs,
  };
}
