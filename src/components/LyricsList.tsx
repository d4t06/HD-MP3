import { ElementRef, FC, useEffect, useRef } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGetSongLyric } from "../hooks";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/store/PlayStatusSlice";
// import { LyricStatus } from "./LyricEditor";
import { scrollIntoView } from "@/utils/appHelpers";

interface Props {
  audioEle: HTMLAudioElement;
  className: string;
  isOpenFullScreen: boolean;
  active: boolean;
}

const LYRIC_TIME_BOUNDED = 0.3;

const LyricsList: FC<Props> = ({ audioEle, className, isOpenFullScreen, active }) => {
  // state
  const { lyricSize } = useSelector(selectAllPlayStatusStore);
  //   const [currentTime, setCurrentTime] = useState<number>(0);
  //   const [currentIndex, setCurrentIndex] = useState(0);

  const scrollBehavior = useRef<ScrollBehavior>("instant");
  const containerRef = useRef<HTMLDivElement>(null);

  //   const prevTime = useRef(0);
  const currentTimeRef = useRef(0);
  const lyricRefs = useRef<ElementRef<"div">[]>([]);
  const currentIndexRef = useRef(0);

  const { loading, songLyrics } = useGetSongLyric({
    audioEle,
    isOpenFullScreen,
  });

  //   const handleUpdateTime = useCallback(() => {
  //     const currentTime = audioEle.currentTime;
  //     setCurrentTime(currentTime);

  //     // disable animation
  //     if (Math.abs(currentTime - prevTime.current) > 20) {
  //       scrollBehavior.current = "instant";
  //       prevTime.current = currentTime;
  //       return;
  //     }
  //     prevTime.current = currentTime;
  //   }, []);

  const handleTimeUpdate = () => {
    const direction =
      audioEle.currentTime > currentTimeRef.current ? "forward" : "backward";

    currentTimeRef.current = audioEle.currentTime;

    let nextIndex = currentIndexRef.current;

    switch (direction) {
      case "forward":
        while (
          songLyrics[nextIndex + 1] &&
          songLyrics[nextIndex + 1].start - LYRIC_TIME_BOUNDED <
            currentTimeRef.current + LYRIC_TIME_BOUNDED
        ) {
          if (!lyricRefs.current[nextIndex + 1]) return;
          nextIndex += 1;
        }
        break;

      case "backward":
        while (
          songLyrics[nextIndex - 1] &&
          songLyrics[nextIndex - 1].end - LYRIC_TIME_BOUNDED >
            currentTimeRef.current + LYRIC_TIME_BOUNDED
        ) {
          if (!lyricRefs.current[nextIndex - 1]) return;
          nextIndex -= 1;
        }
        break;
    }

    if (nextIndex !== currentIndexRef.current) {
      // make scroll instantly
      if (Math.abs(nextIndex - currentIndexRef.current) > 5)
        scrollBehavior.current = "instant";

      // inactive old
      if (lyricRefs.current[currentIndexRef.current]) {
        Object.assign(lyricRefs.current[currentIndexRef.current].style, {
          opacity: ".6",
          color: "white",
        });

        lyricRefs.current[currentIndexRef.current].classList.remove("active-lyric");
      }

      currentIndexRef.current = nextIndex;

      // active new index
      Object.assign(lyricRefs.current[currentIndexRef.current].style, {
        color: "#ffed00",
      });
      lyricRefs.current[currentIndexRef.current].classList.add("active-lyric");

      // scroll
      scrollIntoView(lyricRefs.current[nextIndex]);
    }
  };

  const lyricSizeMap = {
    small: "text-[20px] sm:text-[30px]",
    medium: "text-[25px] sm:text-[35px]",
    large: "text-[30px] sm:text-[40px]",
  };

  const renderItem = () => {
    return songLyrics.map((l, index) => {
      // const bounce = 0.3;

      // let status: LyricStatus = "coming";
      // const inRange = currentTime >= l.start - bounce && currentTime < l.end - bounce;

      // if (inRange && currentTime) status = "active";
      // else if (currentTime > l.end - bounce) status = "done";

      return (
        <LyricItem
          ref={(el) => (lyricRefs.current[index] = el!)}
          status={"coming"}
          key={index}
          text={l.text}
          scrollBehavior={scrollBehavior}
          className={`font-[700] ${
            lyricSizeMap[lyricSize || "medium"]
          } mb-[30px] last:mb-[50vh]`}
        />
      );
    });
  };

  // add event listeners
  useEffect(() => {
    if (!active || !songLyrics.length) return;
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [active, songLyrics]);

  //   update ref variables
  useEffect(() => {
    //  currentIndexRef.current = currentIndex;
  }, []);

  /**
   * scroll to active lyric instant
   * cause' the song may in chorus
   */
  useEffect(() => {
    const activeLyric = document.querySelector(".active-lyric");
    if (activeLyric) {
      activeLyric.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [active]);

  const classes = {
    container: "no-scrollbar pt-[20px] mask-image overflow-y-auto overflow-x-hidden",
    loadingContainer: "flex justify-center items-center h-full w-full",
    loadingIcon: "opacity-[.6] animate-spin w-[35px] duration-[2s]",
  };

  return (
    <div ref={containerRef} className={`${classes.container} ${className}`}>
      {loading && (
        <div className={classes.loadingContainer}>
          <span>
            <ArrowPathIcon className={classes.loadingIcon} />
          </span>
        </div>
      )}

      {!loading && (
        <>
          {songLyrics.length ? (
            renderItem()
          ) : (
            <div className={classes.loadingContainer}>
              <h1 className="text-[30px] opacity-60">...</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LyricsList;
