import { FC, useCallback, useEffect, useRef, useState } from "react";
import LyricItem from "./child/LyricItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGetSongLyric } from "../hooks";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store";

interface Props {
  audioEle: HTMLAudioElement;
  className: string;
  isOpenFullScreen: boolean;
}

const LyricsList: FC<Props> = ({ audioEle, className, isOpenFullScreen }) => {
  const { song: songInStore } = useSelector(selectAllSongStore);

  // state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const firstTimeRender = useRef(true);
  const scrollBehavior = useRef<ScrollBehavior>("instant");
  const containerRef = useRef<HTMLDivElement>(null);

  const { loading, songLyric } = useGetSongLyric({
    audioEle,
    isOpenFullScreen,
    songInStore,
  });

  const handleUpdateTime = useCallback(() => {
    setCurrentTime(audioEle.currentTime);
  }, []);

  const renderItem = () => {
    return songLyric.real_time.map((lyricItem, index) => {
      const bounce = 0.3;
      const inRange =
        currentTime >= lyricItem.start - bounce && lyricItem.end > currentTime + bounce;
      return (
        <LyricItem
          firstTimeRender={firstTimeRender}
          scrollBehavior={scrollBehavior}
          key={index}
          done={!inRange && currentTime > lyricItem.end}
          active={inRange}
          className="mb-[30px]"
        >
          {lyricItem.text}
        </LyricItem>
      );
    });
  };

  useEffect(() => {
    if (!audioEle) return;

    if (!currentTime) {
      handleUpdateTime();
    }

    audioEle.addEventListener("timeupdate", handleUpdateTime);

    return () => {
      setCurrentTime(0);
      firstTimeRender.current = true;

      const containerEle = containerRef.current as HTMLDivElement;

      if (containerEle) containerEle.scrollTop = 0;
      if (audioEle) audioEle.removeEventListener("timeupdate", handleUpdateTime);
    };
  }, []);

  const classes = {
    container: "overflow-y-auto overflow-x-hidden no-scrollbar pt-[30px] mask-image",
    loadingContainer: "flex justify-center items-center h-full w-full",
  };

  return (
    <div ref={containerRef} className={`${className && className} ${classes.container}`}>
      {loading && (
        <div className={classes.loadingContainer}>
          <span>
            <ArrowPathIcon className="opacity-[.6] animate-spin w-[35px] duration-[2s]" />
          </span>
        </div>
      )}

      {!loading && (
        <>
          {songLyric.real_time.length ? (
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
