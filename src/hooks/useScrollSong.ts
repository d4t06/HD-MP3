import { MutableRefObject, RefObject, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";

type Props = {
  containerRef?: RefObject<HTMLDivElement>;
  songItemRef?: RefObject<HTMLDivElement>;
  firstTimeRender: MutableRefObject<Boolean>;
  isOpenFullScreen?: boolean;
};

const scrollToActiveSong = (
  songItemEle: HTMLDivElement,
  containerEle: HTMLDivElement
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
  if (needToScroll === 0) return;

  console.log("scroll to active");

  // case element not in view
  if (Math.abs(lefDiff) > windowWidth || Math.abs(rightDiff) > windowWidth) {
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
};

export default function useScrollSong({
  containerRef,
  songItemRef,
  isOpenFullScreen,
}: Props) {
  const { song: songInStore } = useSelector(selectAllSongStore);

  const handleScrollToActiveSong = () => {
    const songItemEle = songItemRef?.current as HTMLDivElement;
    const containerEle = containerRef?.current as HTMLDivElement;

    scrollToActiveSong(songItemEle, containerEle);
  };

  useEffect(() => {
    if (!isOpenFullScreen) return;
    if (!scroll || !containerRef?.current || !songItemRef?.current) {
      console.log("lack props");
      return;
    }

    if (!songInStore.name) return;

    if (!isOpenFullScreen) {
      return;
    }

    handleScrollToActiveSong();
  }, [songInStore, isOpenFullScreen]);
}

export { scrollToActiveSong };
