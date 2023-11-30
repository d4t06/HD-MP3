import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllSongStore,
  setSong,
  useTheme,
  useActuallySongs,
  useAuthStore,
} from "../store";

import { handleTimeText } from "../utils/appHelpers";

import PlayPauseButton from "./child/PlayPauseButton";
import { Song, User } from "../types";
import { useLocation } from "react-router-dom";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { mySetDoc } from "../utils/firebaseHelpers";
import { Countdown } from "./";

interface Props {
  admin?: boolean;
  audioEle: HTMLAudioElement;
  idle: boolean;
  isOpenFullScreen: boolean;
}

export default function Control({ audioEle, admin, isOpenFullScreen }: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { userInfo } = useAuthStore();
  const { actuallySongs } = useActuallySongs();
  const {
    playStatus: { isPlaying, isRepeat, isShuffle, isError },
  } = useSelector(selectAllPlayStatusStore);
  const { song: songInStore, playlist: playlistInStore } =
    useSelector(selectAllSongStore);

  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const [someThingToTriggerError, setSomeThingToTriggerError] = useState(0);

  // ref
  const currentIndex = useRef(0);
  const durationRef = useRef(0);
  const durationLineWidth = useRef<number>();
  const durationLine = useRef<HTMLDivElement>(null);
  const timeProcessLine = useRef<HTMLDivElement>(null);

  const currentTimeRef = useRef<HTMLDivElement>(null);
  const remainingTime = useRef<HTMLDivElement>(null);
  const prevSeekTime = useRef(0);

  const isEndOfList = useRef(false);

  const firstTimePlay = useRef(true);
  const history = useRef<string[]>([]);

  // use hook
  const location = useLocation();
  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const updateHistory = async () => {
   if (admin) return;
    if (!songInStore.id) return;

    let newHistory = [...history.current];

    const index = newHistory.find((id) => id === songInStore.id);
    if (index) return;

    newHistory.push(songInStore.id);
    if (newHistory.length > 5) newHistory = newHistory.slice(1);
    if (newHistory.length < history.current.length) return;

    history.current = newHistory;

    await mySetDoc({
      collection: "users",
      data: { play_history: newHistory } as Partial<User>,
      id: userInfo.email,
      msg: ">>> api: set play history",
    });
  };

  const play = () => {
    audioEle?.play();

    if (!userInfo.email) return;

    if (firstTimePlay.current) {
      firstTimePlay.current = false;
      updateHistory();
    }
  };

  const pause = () => {
    audioEle?.pause();
  };

  const getNewSong = (index: number) => {
    return actuallySongs[index];
  };

  // >>> click handle
  const handlePlayPause = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying]);

  const handlePause = () => {
    dispatch(setPlayStatus({ isPlaying: false }));
  };

  const handleRepeatSong = () => {
    let value: typeof isRepeat;
    switch (isRepeat) {
      case "no":
        value = "one";
        break;
      case "one":
        value = "all";
        break;
      case "all":
        value = "no";
        break;
      default:
        value = "no";
    }

    dispatch(setPlayStatus({ isRepeat: value }));
  };

  const handlePlaying = () => {
    dispatch(setPlayStatus({ isPlaying: true, isWaiting: false, isError: false }));
  };

  const handleWaiting = () => {
    dispatch(setPlayStatus({ isWaiting: true }));
  };

  const handleResetForNewSong = () => {
    const timeProcessLineElement = timeProcessLine.current as HTMLElement;

    if (timeProcessLineElement && currentTimeRef.current && remainingTime.current) {
      currentTimeRef.current.innerText = "00:00";
      remainingTime.current.innerText = "00:00";
      timeProcessLineElement.style.width = "0%";
    }
  };

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;
      if (durationLineWidth.current && durationRef.current) {
        const clientRect = node.getBoundingClientRect();
        const timeProcessLineElement = timeProcessLine.current as HTMLElement;

        const length = e.clientX - clientRect.left;
        const lengthRatio = length / durationLineWidth.current;
        const newSeekTime = Math.ceil(lengthRatio * durationRef.current);

        if (audioEle && timeProcessLineElement) {
          const currentTime = audioEle.currentTime;

          if (prevSeekTime.current) {
            if (
              Math.abs(currentTime - prevSeekTime.current) < 1 &&
              Math.abs(newSeekTime - prevSeekTime.current) < 1
            ) {
              console.log("no seek");
              return;
            }
          }

          audioEle.currentTime = newSeekTime;
          prevSeekTime.current = newSeekTime;
          timeProcessLineElement.style.width = (lengthRatio * 100).toFixed(1) + "%";

          if (!isPlaying) play();
          else dispatch(setPlayStatus({ isWaiting: true }));
        }
      }
    },
    [isOpenFullScreen, songInStore]
  );

  const handleNext = useCallback(() => {
    let newIndex = currentIndex.current + 1;
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
    if (isRepeat === "one") {
      console.log("song repeat one");

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
      if (isRepeat === "all") isEndOfList.current = false;
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

    if (isInEdit) {
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    play();
  };

  const handleError = () => {
    setSomeThingToTriggerError(Math.random());
  };

  const updateProcessLineWidth = () => {
    durationLineWidth.current = durationLine.current?.offsetWidth;
  };

  // add events listener
  useEffect(() => {
    if (!audioEle) return;

    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("playing", handlePlaying);
    audioEle.addEventListener("timeupdate", handleTimeUpdate);
    audioEle.addEventListener("waiting", handleWaiting);
    window.addEventListener("resize", updateProcessLineWidth);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePause);
      audioEle.removeEventListener("playing", handlePlaying);
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
      audioEle.removeEventListener("waiting", handleWaiting);
      window.removeEventListener("resize", updateProcessLineWidth);
    };
  }, []);

  useEffect(() => {
    if (!someThingToTriggerError) return;
    if (songInStore.name) dispatch(setPlayStatus({ isWaiting: false, isError: true }));
  }, [someThingToTriggerError]);

  // update audio src, currentIndex
  useEffect(() => {
    if (!audioEle || !songInStore.name) {
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    pause();
    dispatch(setPlayStatus({ isWaiting: true, isError: false }));

    audioEle.src = songInStore.song_url;
    currentIndex.current = songInStore.currentIndex;

    if (songInStore.name) {
      document.title = `${songInStore.name} - ${songInStore.singer}`;
    }

    return () => {
      handleResetForNewSong();
      firstTimePlay.current = true;
    };
  }, [songInStore]);

  // update site title
  useEffect(() => {
    if (!songInStore.name) return;

    let myTitle = `${songInStore.name} - ${songInStore.singer}`;
    if (
      !isPlaying &&
      playlistInStore.name &&
      songInStore.song_in.includes(playlistInStore.id)
    ) {
      myTitle = `${playlistInStore.name}`;
    }
    document.title = myTitle;
  }, [isPlaying]);

  // add new song end event
  useEffect(() => {
    if (!audioEle) return;
    audioEle?.addEventListener("ended", handleEnded);

    return () => audioEle?.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, songInStore.song_in, actuallySongs]);

  // update process lines width
  useEffect(() => {
    updateProcessLineWidth();
  }, [isOpenFullScreen]);

  // prevent song autoplay after edit finish
  useEffect(() => {
    if (!audioEle) return;
    if (isInEdit) {
      if (isPlaying) pause();
    }

    if (!history.current.length && userInfo.play_history.length) {
      history.current = userInfo.play_history;
    }

    audioEle.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audioEle.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [isInEdit, songInStore.id, userInfo.like_song_ids]);

  const classes = {
    button: `p-[5px] ${actuallySongs.length <= 1 && "opacity-20 pointer-events-none"}`,
    buttonsContainer: `w-full flex justify-center items-center gap-x-[20px] ${
      admin ? "" : "h-[50px]"
    }`,
    processContainer: `flex w-full flex-row items-center h-[30px] ${
      admin ? "h-full" : ""
    }`,
    processLineBase: `h-[4px] flex-grow relative cursor-pointer rounded-[99px] bg-gray-200 `,
    processLineCurrent: `absolute left-0 rounded-l-[99px] top-0 h-full ${theme.content_bg}`,
    currentTime: `opacity-60 text-[14px] font-semibold`,
    duration: `text-[14px] font-semibold`,
    icon: "w-[30px] max-[350px]:w-[25px]",
    before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
  };

  return (
    <div className="relative h-full w-full">
      {/* buttons */}
      <div className={`${classes.buttonsContainer}`}>
        {!admin && (
          <>
            <button
              className={`relative ${classes.button} ${
                isRepeat !== "no" && theme.content_text
              }`}
              onClick={() => handleRepeatSong()}
            >
              <ArrowPathRoundedSquareIcon className={classes.icon} />
              <span className="absolute font-bold text-[12px] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
                {songInStore.name &&
                  (isRepeat === "one" ? "1" : isRepeat === "all" ? "--" : "")}
              </span>
            </button>
            <button className={classes.button} onClick={() => handlePrevious()}>
              <BackwardIcon className={classes.icon} />
            </button>

            <PlayPauseButton handlePlayPause={handlePlayPause} />

            <button className={`${classes.button}`} onClick={() => handleNext()}>
              <ForwardIcon className={classes.icon} />
            </button>
            <button
              className={`${classes.button} ${isShuffle && theme.content_text}`}
              onClick={() => dispatch(setPlayStatus({ isShuffle: !isShuffle }))}
            >
              <ArrowTrendingUpIcon className={classes.icon} />
            </button>
          </>
        )}
      </div>

      {/* process */}
      <div
        className={`${classes.processContainer} ${
          isError ? "opacity-[.6] pointer-events-none" : ""
        }`}
      >
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
          className={`${classes.processLineBase} ${!isLoaded && "pointer-events-none"}  ${
            classes.before
          }`}
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

        {admin && (
          <div className="flex items-center">
            <PlayPauseButton handlePlayPause={handlePlayPause} />
            <button className={`${classes.button}`} onClick={() => handleNext()}>
              <ForwardIcon className={classes.icon} />
            </button>
          </div>
        )}
      </div>

      <Countdown
        isOpenFullScreen={isOpenFullScreen}
        cb={pause}
        play={play}
        isPlaying={isPlaying}
      />
    </div>
  );
}
