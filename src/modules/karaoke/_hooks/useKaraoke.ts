import createKeyFrame from "@/utils/createKeyFrame";
import { getWordsRatio } from "@/utils/getWordsRatio";
import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import {
  PlayStatus,
  selectAllPlayStatusStore,
} from "@/stores/redux/PlayStatusSlice";
import { useLyricContext, usePlayerContext } from "@/stores";
import { mergeGrow } from "@/utils/mergeGrow";
import { useSelector } from "react-redux";

const LYRIC_TIME_BOUNDED = 0.3;

const isOdd = (n: number) => {
  return n % 2 !== 0;
};

type Props = {
  bounded?: number;
};

export default function useKaraoke(props?: Props) {
  const { songLyrics, loading } = useLyricContext();
  const { audioRef, isOpenFullScreen, activeTab } = usePlayerContext();
  if (!audioRef.current) throw new Error("useKaraoke !audioRef.current");

  const { playStatus } = useSelector(selectAllPlayStatusStore);

  const [currentIndex, setCurrentIndex] = useState(0);

  const oddOverlay = useRef<ElementRef<"p">>(null);
  const evenOverlay = useRef<ElementRef<"p">>(null);

  const tempEventText = useRef<ElementRef<"div">>(null);
  const tempOddText = useRef<ElementRef<"div">>(null);

  const currentTimeRef = useRef(0);
  const currentIndexRef = useRef(0);
  const playsStatusRef = useRef<PlayStatus>("paused");

  const isSwitchedTabs = useRef(false); // readd animation when switch between tabs

  const isOpenKaraokeTab = useMemo(
    () => isOpenFullScreen && activeTab == "Karaoke",
    [isOpenFullScreen, activeTab],
  );

  // const { songLyrics, loading, playStatus } = useGetSongLyric({ active });

  const textData = useMemo(() => {
    if (!songLyrics.length) return { odd: "", even: "" };
    else {
      if (currentIndex < 0) return { odd: "", even: "" };

      const _isOdd = isOdd(currentIndex);
      if (!songLyrics[currentIndex + 1]) return { odd: "", even: "" };

      const indexArr = _isOdd
        ? [currentIndex, currentIndex + 1]
        : [currentIndex + 1, currentIndex];

      const odd = songLyrics[indexArr[0]].text.trim();

      const even = songLyrics[indexArr[1]].text.trim();

      return {
        odd,
        even,
      };
    }
  }, [currentIndex, songLyrics]);

  const clearAnimation = (overlay: ElementRef<"p">) => {
    overlay.style.animation = `none`;
  };

  const applyAnimation = (
    name: string,
    lyric: Lyric,
    overlay: ElementRef<"p">,
    delay: number,
  ) => {
    let state = "running";
    if (playsStatusRef.current === "paused") state = "paused";

    overlay.style.animation = `${name} ${
      (lyric?.tune?.end || lyric.end) - (lyric?.tune?.start || lyric.start)
    }s linear ${state} forwards`;

    const fixedDelay = +delay.toFixed(1);

    if (Math.abs(fixedDelay) > 0.2) {
      overlay.style.animationDelay = `${fixedDelay}s`;
    }
  };

  const handleTimeUpdate = () => {
    if (!songLyrics.length) return;

    const direction =
      audioRef.current!.currentTime >= currentTimeRef.current
        ? "forward"
        : "backward";

    currentTimeRef.current = audioRef.current!.currentTime;

    let nextIndex = currentIndexRef.current;

    const _bounded = props?.bounded || LYRIC_TIME_BOUNDED;

    switch (direction) {
      case "forward":
        while (
          nextIndex < songLyrics.length &&
          songLyrics[nextIndex + 1] &&
          songLyrics[nextIndex + 1].start - _bounded <
            currentTimeRef.current + _bounded
        ) {
          nextIndex += 1;
        }
        break;

      case "backward":
        while (
          nextIndex > 0 &&
          songLyrics[nextIndex - 1] &&
          songLyrics[nextIndex - 1].end - _bounded >
            currentTimeRef.current + _bounded
        ) {
          nextIndex -= 1;
        }
        break;
    }

    /** or difference index or switch between tabs
     *  only work if next index difference from current */
    if (
      nextIndex !== currentIndexRef.current ||
      isSwitchedTabs.current ||
      playsStatusRef.current === "paused" ||
      playsStatusRef.current === "waiting"
    ) {
      isSwitchedTabs.current = false;

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      if (
        !oddOverlay.current ||
        !evenOverlay.current ||
        !tempOddText.current ||
        !tempEventText.current
      )
        return;

      const nextLyric = songLyrics[nextIndex];
      const { tune, text, cut } = nextLyric;

      const past = currentTimeRef.current + _bounded - tune.start;
      const words = text.split(" ");

      const _isOdd = isOdd(nextIndex);
      const widthRatioList = getWordsRatio(
        _isOdd ? tempOddText.current : tempEventText.current,
      );

      const mergedGrowList = mergeGrow(words, cut, tune.grow);

      const overlayList = _isOdd
        ? [oddOverlay.current, evenOverlay.current]
        : [evenOverlay.current, oddOverlay.current];

      const name = createKeyFrame(mergedGrowList, widthRatioList);
      applyAnimation(name, nextLyric, overlayList[0], -past);
      clearAnimation(overlayList[1]);
    }
  };

  // decide run whatever run animation or not
  useEffect(() => {
    if (playsStatusRef.current === "waiting")
      // need delay for update animation
      setTimeout(() => {
        playsStatusRef.current = playStatus;
      }, 300);
    else playsStatusRef.current = playStatus;
  }, [playStatus]);

  // immediately show lyric when tab active
  useEffect(() => {
    if (isOpenKaraokeTab) {
      isSwitchedTabs.current = true;
      if (playStatus === "paused") handleTimeUpdate();
    }
  }, [isOpenKaraokeTab]);

  // decide whatever run or not
  useEffect(() => {
    if (!songLyrics.length || !isOpenKaraokeTab) return;

    audioRef.current!.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current!.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [songLyrics, isOpenKaraokeTab]);

  // reset when change song
  useEffect(() => {
    return () => {
      currentTimeRef.current = 0;
      currentIndexRef.current = -1;
      setCurrentIndex(0);
    };
  }, [songLyrics]);

  return {
    loading,
    currentIndexRef,
    oddOverlay,
    evenOverlay,
    currentIndex,
    textData,
    tempEventText,
    tempOddText,
  };
}
