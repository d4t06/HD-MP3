import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { usePlayerContext } from "../_components/PlayerContext";
import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";

type Props = {
  index: number;

  songItemRef: RefObject<HTMLDivElement | null>;
};

export default function useSongCardEffect({ index, songItemRef }: Props) {
  const { currentIndex, setCurrentIndex } = useSongsContext();
  const { setCanPlay, canPlay, controlRef, statusRef } = usePlayerContext();
  const [isIntoView, setIsIntoView] = useState(false);

  const timerId = useRef<NodeJS.Timeout>();

  const isActive = useMemo(() => currentIndex === index, [currentIndex]);

  const handleIntoView = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;

    setIsIntoView(entry.isIntersecting);
  };

  // play song when active
  useEffect(() => {
    if (isActive) {
      console.log("active", currentIndex, index);

      if (canPlay) {
        controlRef.current?.play();
      } else {
        setCanPlay(true);
      }
    } else {
      // song loaded before
      if (canPlay)
        if (statusRef.current === "playing") controlRef.current?.pause();
    }
  }, [isActive]);

  // update isIntoView
  useEffect(() => {
    if (songItemRef.current) {
      const observer = new IntersectionObserver(handleIntoView, {
        threshold: 1,
      });
      observer.observe(songItemRef.current);
    }
  }, []);

  // update current index when into view
  useEffect(() => {
    timerId.current = setTimeout(() => {
      if (isIntoView) {
        console.log("is into view");

        setCurrentIndex(index);
      }
    }, 600);

    return () => {
      clearTimeout(timerId.current);
    };
  }, [isIntoView]);
}
