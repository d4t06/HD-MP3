import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSongQueue,
  setCurrentQueueId,
} from "@/stores/redux/songQueueSlice";
import { usePlayerContext } from "@/stores";
import {
  PlayStatus,
  selectAllPlayStatusStore,
} from "@/stores/redux/PlayStatusSlice";

const handleTouchPadScroll = () => {
  window.dispatchEvent(new Event("mousemove"));
};

export function scrollToHorizontalCenter(
  songItemEle: HTMLElement,
  containerEle: HTMLElement,
  idle: boolean = false,
) {
  const windowWidth = window.innerWidth;

  const rect = songItemEle.getBoundingClientRect();
  const lefDiff = rect.left;
  const rightDiff = windowWidth - (lefDiff + songItemEle.offsetWidth);

  const needToScroll = Math.abs(Math.ceil(lefDiff - rightDiff)) / 2;

  if (needToScroll < 5) return false;

  if (idle) {
    containerEle.onscroll = () => {};
    setTimeout(() => {
      // console.log("add event again");
      containerEle.onscroll = handleTouchPadScroll;
    }, 900);
  }

  // case element not in view
  if (
    idle ||
    Math.abs(lefDiff) > windowWidth ||
    Math.abs(rightDiff) > windowWidth
  ) {
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
}

export default function useScrollSong() {
  const dispatch = useDispatch();
  const { isOpenFullScreen, idle } = usePlayerContext();

  const { currentQueueId } = useSelector(selectSongQueue);
  const { playStatus } = useSelector(selectAllPlayStatusStore);

  //  ref;
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSongRef = useRef<HTMLDivElement>(null);
  const playStatusRef = useRef<PlayStatus>("paused");

  const handleScrollToActiveSong = () => {
    if (!activeSongRef?.current || !containerRef?.current) return;

    scrollToHorizontalCenter(activeSongRef.current, containerRef.current, idle);
  };

  const handleArrowKeys = (key: KeyboardEvent["key"]) => {
    let centeredEle = document.querySelector(".song-thumb.centered");
    if (!centeredEle) {
      if (!activeSongRef.current) return;
      else centeredEle = activeSongRef.current;
    }

    let newCenteredEle;

    switch (key) {
      case "ArrowRight":
        newCenteredEle = centeredEle.nextElementSibling;

        break;
      case "ArrowLeft":
        newCenteredEle = centeredEle.previousElementSibling;

        break;
    }

    if (newCenteredEle && containerRef.current) {
      centeredEle.classList.remove("centered");
      newCenteredEle.classList.add("centered");

      scrollToHorizontalCenter(
        newCenteredEle as HTMLElement,
        containerRef.current,
      );
    }
  };

  const handleActiveSong = () => {
    if (!activeSongRef.current) return;
    const centeredEle = document.querySelector(".song-thumb.centered");

    // if (!centeredEle || centeredEle.getAttribute("queue-id") === currentQueueId) {
    //   console.log("go here");

    //   switch (playStatusRef.current) {
    //     case "playing":
    //       return dispatch(setPlayStatus({ triggerPlayStatus: "paused" }));
    //     case "paused":
    //       return dispatch(setPlayStatus({ triggerPlayStatus: "playing" }));
    //   }
    // }

    const newQueueId = centeredEle?.getAttribute("queue-id");
    if (newQueueId) dispatch(setCurrentQueueId(newQueueId));
  };

  const handleKeyboardEvent = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      return handleArrowKeys(e.key);
    }

    if (e.key === "Enter") {
      handleActiveSong();
    }
  };

  useEffect(() => {
    if (!isOpenFullScreen) return;

    handleScrollToActiveSong();
  }, [currentQueueId, isOpenFullScreen]);

  useEffect(() => {
    if (!isOpenFullScreen) return;

    document.addEventListener("keydown", handleKeyboardEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent);
      document
        .querySelector(".song-thumb.centered")
        ?.classList.remove("centered");
    };
  }, [currentQueueId, isOpenFullScreen]);

  useEffect(() => {
    const containerEle = containerRef?.current as HTMLDivElement;
    if (!containerEle) return;

    containerEle.onscroll = handleTouchPadScroll;

    return () => {
      containerEle.onscroll = () => {};
    };
  }, []);

  // update playStatusRef
  useEffect(() => {
    playStatusRef.current = playStatus;
  }, [playStatus]);

  return { activeSongRef, containerRef };
}
