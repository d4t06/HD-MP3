import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong, useTheme, useActuallySongs } from "../store";

import { handleTimeText } from "../utils/appHelpers";

import PlayPauseButton from "./child/PlayPauseButton";
import { Song } from "../types";
import { useLocation } from "react-router-dom";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";

interface Props {
  audioEle: HTMLAudioElement;
  idle: boolean;
  isOpenFullScreen: boolean;
  //   isPlaying: boolean;
  //   isWaiting: boolean;

  //   setIsWaiting: Dispatch<SetStateAction<boolean>>;
  //   dispatch: Dispatch<React.SetStateAction<booleansetPlayStatus({isPlaying: true});
}

export default function Control({
  audioEle,
  // idle,
  isOpenFullScreen,
}: //   isPlaying,
//   isWaiting,

//   setPlayStatus({isPlaying: true}),
//   setIsWaiting,
Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const {
    playStatus: { isPlaying, isRepeatPlaylist, isRepeat, isShuffle, isWaiting },
  } = useSelector(selectAllPlayStatusStore);
  const { song: songInStore } = useSelector(selectAllSongStore);
  const { actuallySongs } = useActuallySongs();

  // usehook
  const location = useLocation();

  // component statte
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // component ref
  const currentIndex = useRef(0);
  const durationRef = useRef(0);
  const durationLineWidth = useRef<number>();
  const durationLine = useRef<HTMLDivElement>(null);
  const timeProcessLine = useRef<HTMLDivElement>(null);

  const currentTimeRef = useRef<HTMLDivElement>(null);
  const remainingTime = useRef<HTMLDivElement>(null);

  const firstTimeRender = useRef(true);
  const isEndOfList = useRef(false);

  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const play = () => {
    audioEle?.play();
    // console.log("play");
  };
  const pause = () => {
    audioEle?.pause();
    // console.log("pause");
  };

  const getNewSong = (index: number) => {
    return actuallySongs[index];
  };

  // >>> click handle
  const handlePlayPause = () => {
    isPlaying ? pause() : play();
  };

  const handlePause = () => {
    dispatch(setPlayStatus({ isPlaying: false }));
  };

  const handlePlaying = () => {
    dispatch(setPlayStatus({ isPlaying: true, isWaiting: false }));
    setError(false);
  };

  const handleWaiting = () => {
    dispatch(setPlayStatus({ isWaiting: true }));
  };

  const handleResetForNewSong = useCallback(() => {
    pause();
    dispatch(setPlayStatus({ isWaiting: true, isLoaded: false }));

    //  setIsWaiting(true);
    //  setIsLoaded(false);

    const timeProcessLineElement = timeProcessLine.current as HTMLElement;

    if (timeProcessLineElement && currentTimeRef.current && remainingTime.current) {
      currentTimeRef.current.innerText = "00:00";
      timeProcessLineElement.style.width = "0%";
    }
  }, []);

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;
      if (durationLineWidth.current && durationRef.current) {
        //   setIsWaiting(true);
        dispatch(setPlayStatus({ isWaiting: true }));

        // get boundingRect
        const clientRect = node.getBoundingClientRect();
        // get elements
        const timeProcessLineElement = timeProcessLine.current as HTMLElement;

        // calculating
        const length = e.clientX - clientRect.left;
        const lengthRatio = length / durationLineWidth.current;
        const newTime = lengthRatio * durationRef.current;

        if (audioEle && timeProcessLineElement) {
          // update current time
          audioEle.currentTime = +newTime.toFixed(1);
          // update process line width
          timeProcessLineElement.style.width = (lengthRatio * 100).toFixed(1) + "%";

          if (!isPlaying) play();
        }
      }
    },
    [isOpenFullScreen, songInStore]
  );

  const handleNext = useCallback(() => {
    let newIndex = currentIndex.current + 1;
    // let songLists: Song[];
    let newSong: Song;

    if (newIndex < actuallySongs.length) {
      newSong = actuallySongs[newIndex];
    } else {
      newSong = actuallySongs[0];
      newIndex = 0;
    }

    dispatch(
      setSong({
        ...newSong,
        currentIndex: newIndex,
        song_in: songInStore.song_in,
      })
    );
  }, [songInStore, actuallySongs]);

  // songInStore, songLists
  const handlePrevious = useCallback(() => {
    let newIndex = currentIndex.current! - 1;
    let newSong: Song;

    if (newIndex >= 0) {
      newSong = actuallySongs[newIndex];
    } else {
      newSong = actuallySongs[actuallySongs.length - 1];
      newIndex = actuallySongs.length - 1;
    }

    dispatch(
      setSong({
        ...newSong,
        currentIndex: newIndex,
        song_in: songInStore.song_in,
      })
    );
  }, [songInStore, actuallySongs]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioEle) return;

    // dispatch(truesetPlayStatus({isPlaying: true});

    const currentTime = audioEle?.currentTime;
    const timeProcessLineEle = timeProcessLine.current as HTMLElement;

    if (durationRef.current && currentTime) {
      const newWidth = currentTime / (durationRef.current / 100);

      timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
    }

    if (currentTimeRef.current) {
      currentTimeRef.current.innerText = handleTimeText(currentTime!) || "00:00";
    }
  }, [songInStore, isOpenFullScreen]);

  const handleEnded = () => {
    if (isRepeat) {
      console.log("song repeat");

      return play();
    }
    if (isShuffle) {
      console.log("song shuffle");

      let randomIndex: number = currentIndex.current!;
      while (randomIndex === currentIndex.current) {
        randomIndex = Math.floor(Math.random() * actuallySongs.length);
      }

      const newSong = getNewSong(randomIndex);

      return dispatch(
        setSong({
          ...newSong,
          currentIndex: randomIndex,
          song_in: songInStore.song_in,
        })
      );
    }

    if (currentIndex.current === actuallySongs.length - 1) {
      if (songInStore.song_in.includes("playlist") && isRepeatPlaylist) {} 
      else isEndOfList.current = true;
    }

    return handleNext();
  };

  const handleLoaded = () => {
    if (!audioEle) return;

    setIsLoaded(true);
    durationRef.current = audioEle.duration;
    durationLineWidth.current = durationLine.current?.offsetWidth;

    // end of list
    if (isEndOfList.current) {
      isEndOfList.current = false;
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    if (firstTimeRender.current || isInEdit) {
      // setIsWaiting(false);
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));

      return;
    }

    play();
  };

  const handleError = useCallback(() => {
    setError(true);
    //  setIsWaiting(false);
    dispatch(setPlayStatus({ isWaiting: false }));
  }, []);

  // add events listener
  useEffect(() => {
    if (!audioEle) return;

    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("playing", handlePlaying);
    audioEle.addEventListener("timeupdate", handleTimeUpdate);
    audioEle.addEventListener("waiting", handleWaiting);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePause);
      audioEle.removeEventListener("playing", handlePlaying);
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
      audioEle.removeEventListener("waiting", handleWaiting);
    };
  }, []);

  // update date audio src
  useEffect(() => {
    if (!audioEle) return;

    audioEle.src = songInStore.song_url;
    currentIndex.current = songInStore.currentIndex;

    return () => {
      if (firstTimeRender.current) {
        firstTimeRender.current = false;
        return;
      }

      handleResetForNewSong();
    };
  }, [songInStore]);

  // add new handle when song end function
  useEffect(() => {
    if (!audioEle) return;
    audioEle?.addEventListener("ended", handleEnded);
    console.log("add new handle function when state change");

    return () => audioEle?.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, isRepeatPlaylist, songInStore.song_in, actuallySongs]);

  // update process lines width
  useEffect(() => {
    durationLineWidth.current = durationLine.current?.offsetWidth;
  }, [isOpenFullScreen]);

  // prevent song autoplay after edit finish
  useEffect(() => {
    if (!audioEle) return;
    if (isInEdit) {
      if (isPlaying) pause();
    }

    audioEle.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audioEle.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [isInEdit]);

  const classes = {
    button: `p-[5px] ${actuallySongs.length <= 1 && "opacity-20 pointer-events-none"}`,
    buttonsContainer: `w-full flex justify-center items-center gap-x-[20px] h-[50px]`,
    processContainer: `flex flex-row items-center h-[30px]`,
    processLineBase: `h-[4px] flex-grow relative cursor-pointer rounded-[99px] bg-gray-200 `,
    processLineCurrent: `absolute left-0 rounded-l-[99px] top-0 h-full ${theme.content_bg}`,
    currentTime: `opacity-60 text-[14px] font-semibold`,
    duration: `text-[14px] font-semibold`,
    icon: "w-[30px] max-[549px]:w-[40px]",
    before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
  };

  return (
    <>
      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        <button
          className={`${classes.button} ${isRepeat && theme.content_text}`}
          onClick={() => dispatch(setPlayStatus({ isRepeat: !isRepeat }))}
        >
          <ArrowPathRoundedSquareIcon className={classes.icon} />
        </button>
        <button className={classes.button} onClick={() => handlePrevious()}>
          <BackwardIcon className={classes.icon} />
        </button>

        <PlayPauseButton
          isError={error}
          isWaiting={isWaiting}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          songInStore={songInStore}
        />

        <button className={`${classes.button}`} onClick={() => handleNext()}>
          <ForwardIcon className={classes.icon} />
        </button>
        <button
          className={`${classes.button} ${isShuffle && theme.content_text}`}
          onClick={() => dispatch(setPlayStatus({ isShuffle: !isShuffle }))}
        >
          <ArrowTrendingUpIcon className={classes.icon} />
        </button>
      </div>

      {/* process */}
      <div className={classes.processContainer}>
        <div className="w-[45px]">
          {audioEle && (
            <span ref={currentTimeRef} className={`${classes.currentTime}`}>
              00:00
            </span>
          )}
        </div>
        <div
          ref={durationLine}
          onClick={(e) => handleSeek(e)}
          className={`${classes.processLineBase} ${
            !isLoaded && "opacity-20 pointer-events-none"
          }  ${classes.before}`}
        >
          <div ref={timeProcessLine} className={`${classes.processLineCurrent}`}></div>
        </div>
        <div className="w-[55px] pl-[5px]">
          {audioEle && (
            <span ref={remainingTime} className={classes.duration}>
              {handleTimeText(durationRef.current) || "00:00"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
