import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store";

export default function useIdle(
  delay: number,
  isOnMobile: boolean,
  isOpenFullScreen: boolean,
  activeSongThumbnailRef: RefObject<HTMLDivElement>
) {
  const { song: songInStore } = useSelector(selectAllSongStore);
  const [idle, setIdle] = useState(false);
  const [someThingToTrigger, setSomeThingToTriggerIdle] = useState(0);
  const timerId = useRef<NodeJS.Timeout>();

  const intObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries, observer) => {
          console.log('log check entries', entries);
        },
        { root: document.querySelector(".song-thumbnail-container") }
      ),
    []
  );

  const handleMouseMove = () => {
    setIdle(false);
    setSomeThingToTriggerIdle(Math.random());
  };

  useEffect(() => {
    if (!isOpenFullScreen) return;
    if (isOnMobile || !songInStore.id) return;

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timerId.current);
    };
  }, [isOpenFullScreen, songInStore]);

  useEffect(() => {
    timerId.current = setTimeout(() => {
      const activeSongEle = activeSongThumbnailRef.current as HTMLDivElement;
      console.log(activeSongEle);
      
      if (activeSongEle) {
        intObserver.observe(activeSongEle);
      }
      setIdle(true);
    }, delay);

    return () => clearTimeout(timerId.current);
  }, [someThingToTrigger]);

  if (!isOpenFullScreen) return false;

  return idle;
}
