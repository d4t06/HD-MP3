import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
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
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import useLocalStorage from "../hooks/useLocalStorage";
import { handleTimeText } from "../utils/appHelpers";

import PlayPauseButton from "./child/PlayPauseButton";
import { Song } from "../types";
import { useActuallySongs } from "../store/ActuallySongsContext";

interface Props {
  audioEle: HTMLAudioElement;
  idle: boolean;
  isOpenFullScreen: boolean;
  isPlaying: boolean;
  isWaiting: boolean;

  setIsWaiting: Dispatch<SetStateAction<boolean>>;
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>;
}

export default function Control({
  audioEle,
  // idle,
  isPlaying,
  isOpenFullScreen,
  isWaiting,

  setIsPlaying,
  setIsWaiting,
}: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { song: songInStore } = useSelector(selectAllSongStore);
  const { actuallySongs } = useActuallySongs();

  // component statte
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [duration, setDuration] = useState<number>();
  const [isRepeat, setIsRepeat] = useLocalStorage<boolean>("repeat", false);
  const [isShuffle, setIsShuffle] = useLocalStorage<boolean>("shuffle", false);

  // component ref
  const durationRef = useRef(0);
  const durationLineWidth = useRef<number>();
  const durationLine = useRef<HTMLDivElement>(null);
  const timeProcessLine = useRef<HTMLDivElement>(null);

  const currentTimeRef = useRef<HTMLDivElement>(null);
  const remainingTime = useRef<HTMLDivElement>(null);

  const firstTimeRender = useRef(true);
  const isEndOfList = useRef(false);

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
    setIsPlaying(false);
  };

  const handlePlaying = () => {
    setIsPlaying(true);
    setIsWaiting(false);
    setError(false);
  };

  const handleWaiting = () => {
    setIsWaiting(true);
  };

  const handleResetForNewSong = useCallback(() => {
    pause();
    setIsWaiting(true);
    setIsLoaded(false);

    const timeProcessLineElement = timeProcessLine.current as HTMLElement;

    if (
      timeProcessLineElement &&
      currentTimeRef.current &&
      remainingTime.current
    ) {
      currentTimeRef.current.innerText = "00:00";
      timeProcessLineElement.style.width = "0%";
    }
  }, []);

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;

      // console.log("check durationLineWidth", durationLineWidth.current);

      if (durationLineWidth.current && durationRef.current) {
        setIsWaiting(true);

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
          timeProcessLineElement.style.width =
            (lengthRatio * 100).toFixed(1) + "%";

          if (!isPlaying) play();
        }
      }
    },
    [isOpenFullScreen, songInStore]
  );

  const handleNext = useCallback(() => {
    let newIndex = songInStore.currentIndex + 1;
    // let songLists: Song[];
    let newSong: Song;

    if (newIndex < actuallySongs.length) {
      newSong = actuallySongs[newIndex];
    } else {
      newSong = actuallySongs[0];
      newIndex = 0;
    }

    // console.log("check new index", actuallySongs.map(song => song.name));

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
    let newIndex = songInStore.currentIndex! - 1;
    let newSong: Song;


    if (newIndex >= 0) {
      newSong = actuallySongs[newIndex];
    } else {
      newSong = actuallySongs[actuallySongs.length - 1];
      newIndex = actuallySongs.length - 1;
    }

    // console.log("check new index", actuallySongs.map(song => song.name));

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

    const currentTime = audioEle?.currentTime;
    const timeProcessLineEle = timeProcessLine.current as HTMLElement;

    if (durationRef.current && currentTime) {
      const newWidth = currentTime / (durationRef.current / 100);

      timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
    }

    if (currentTimeRef.current) {
      currentTimeRef.current.innerText =
        handleTimeText(currentTime!) || "00:00";
    }
  }, [songInStore, isOpenFullScreen]);

  const handleEnded = useCallback(() => {
    // console.log("isRepeat, isShuffle =", isRepeat, isShuffle);

    if (isRepeat) {
      console.log("song repeat");

      return play();
    }
    if (isShuffle) {
      console.log("song shuffle");

      let randomIndex: number = songInStore.currentIndex!;
      while (randomIndex === songInStore.currentIndex) {
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

    if (songInStore.currentIndex === actuallySongs.length - 1)
      isEndOfList.current = true;

    return handleNext();
  }, [isRepeat, isShuffle, songInStore, actuallySongs]);

  const handleLoaded = useCallback(() => {
    if (!audioEle) return;

    // set duration
    // setDuration(audioEle?.duration);
    durationRef.current = audioEle.duration;
    setIsLoaded(true);

    // set duration base line width
    durationLineWidth.current = durationLine.current?.offsetWidth;

    // if (currentTimeRef.current && remainingTime.current) {
    //    remainingTime.current.innerText = "-" + handleTimeText(audioEle.duration);
    // }

    // play song if click it
    if (isEndOfList.current) {
      isEndOfList.current = false;
      setIsWaiting(false);
      setIsPlaying(false);

      return;
    }
    firstTimeRender.current && !isEndOfList ? "" : play();
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setIsWaiting(false);
  }, []);

  // add events listener
  useEffect(() => {
    if (!audioEle) return;

    audioEle.addEventListener("loadedmetadata", handleLoaded);
    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("playing", handlePlaying);
    audioEle.addEventListener("timeupdate", handleTimeUpdate);
    audioEle.addEventListener("waiting", handleWaiting);

    return () => {
      audioEle.removeEventListener("loadedmetadata", handleLoaded);
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
    // need to render after state change
    if (!audioEle) return;
    audioEle?.addEventListener("ended", handleEnded);
    // console.log("add new handle function when state change");

    return () => audioEle?.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, songInStore, actuallySongs]);

  // update process lines width
  useEffect(() => {
    durationLineWidth.current = durationLine.current?.offsetWidth;
  }, [isOpenFullScreen]);

  const classes = {
    button: `p-[5px] ${
      actuallySongs.length <= 1 && "opacity-20 pointer-events-none"
    }`,
    buttonsContainer: `w-full flex justify-center items-center gap-x-[20px] h-[50px]`,
    processContainer: `flex flex-row items-center h-[30px]`,
    processLineBase: `h-[4px] hover:h-[6px] flex-1 relative cursor-pointer rounded-3xl overflow-hidden ${
      theme.type === "light" ? "bg-gray-400" : "bg-gray-200"
    }`,
    processLineCurrent: `absolute left-0 top-0 h-full ${theme.content_bg}`,
    currentTime: `text-gray-500 text-[14px] font-semibold`,
    duration: `text-[14px] font-semibold`,
    icon: "w-[30px] ",
  };

  // console.log('control check actuallySongs', songLists.map(song =>song.name));

  return (
    <>
      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        <button
          className={`${classes.button} ${isRepeat && theme.content_text}`}
          onClick={() => setIsRepeat(!isRepeat)}
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
          onClick={() => setIsShuffle(!isShuffle)}
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
          }`}
        >
          <div
            ref={timeProcessLine}
            className={`${classes.processLineCurrent}`}
          ></div>
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
