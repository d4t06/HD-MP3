import { RefObject, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/store/songQueueSlice";

type Props = {
  containerRef?: RefObject<HTMLDivElement>;
  songItemRef?: RefObject<HTMLDivElement>;
  isOpenFullScreen?: boolean;
  idle: boolean;
};

const handleTouchPadScroll = () => {
  window.dispatchEvent(new Event("mousemove"));
};

const scrollToActiveSong = (
  songItemEle: HTMLDivElement,
  containerEle: HTMLDivElement,
  idle: boolean = false
) => {
  const windowWidth = window.innerWidth;

  if (!songItemEle || !containerEle) {
    console.log("ele not found");
    return;
  }

  const rect = songItemEle.getBoundingClientRect();
  const lefDiff = rect.left;
  const rightDiff = windowWidth - (lefDiff + songItemEle.offsetWidth);

  const needToScroll = Math.abs(Math.ceil(lefDiff - rightDiff)) / 2;

  // case element position don't change
  if (needToScroll < 5) return false;

  if (idle) {
    containerEle.onscroll = () => {};
    setTimeout(() => {
      // console.log("add event again");
      containerEle.onscroll = handleTouchPadScroll;
    }, 900);
  }

  // case element not in view
  if (idle || Math.abs(lefDiff) > windowWidth || Math.abs(rightDiff) > windowWidth) {
    containerEle.style.scrollBehavior = "auto";
  } else {
    containerEle.style.scrollBehavior = "smooth";
  }

  // case in view
  //on the left side
  let newScroll = containerEle.scrollLeft;
  if (rightDiff > lefDiff) {
    setTimeout(() => {
      containerEle.scrollLeft = newScroll - needToScroll;
    }, 300);

    // on the right side
  } else if (rightDiff < lefDiff) {
    // newScroll += needToScroll;
    setTimeout(() => {
      containerEle.scrollLeft = newScroll + needToScroll;
    }, 300);
  }

  return true;
};

export default function useScrollSong({
  containerRef,
  songItemRef,
  isOpenFullScreen,
  idle,
}: Props) {
  const { currentSongData } = useSelector(selectSongQueue);

  const handleScrollToActiveSong = () => {
    const songItemEle = songItemRef?.current as HTMLDivElement;
    const containerEle = containerRef?.current as HTMLDivElement;

    scrollToActiveSong(songItemEle, containerEle, idle);
  };

  useEffect(() => {
    if (!currentSongData || !isOpenFullScreen) return;
    if (!scroll || !containerRef?.current || !songItemRef?.current) {
      return;
    }

    handleScrollToActiveSong();
  }, [currentSongData?.song, isOpenFullScreen]);

  useEffect(() => {
    const containerEle = containerRef?.current as HTMLDivElement;
    if (!containerEle) return;

    containerEle.onscroll = handleTouchPadScroll;

    return () => {
      containerEle.onscroll = () => {};
    };
  }, []);
}

export { scrollToActiveSong };
