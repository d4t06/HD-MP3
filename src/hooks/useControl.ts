import {
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong, useActuallySongs, useAuthStore } from "../store";

import { handleTimeText } from "../utils/appHelpers";

import { Song, User } from "../types";
import { useLocation } from "react-router-dom";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { mySetDoc } from "../utils/firebaseHelpers";

import { useLocalStorage } from "../hooks";
import useWindowResize from "./useWindowResize";

interface Props {
  admin?: boolean;
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
  durationLineRef: RefObject<HTMLDivElement>;
  timeProcessLine: RefObject<HTMLDivElement>;
  currentTimeRef: RefObject<HTMLDivElement>;
  remainingTimeRef: RefObject<HTMLDivElement>;
}

export default function useControl({
  audioEle,
  admin,
  isOpenFullScreen,
  durationLineRef,
  timeProcessLine,
  currentTimeRef,
  remainingTimeRef,
}: Props) {
  // use store
  const dispatch = useDispatch();
  const { userInfo } = useAuthStore();
  const { actuallySongs } = useActuallySongs();
  const {
    playStatus: { isPlaying, isRepeat, isShuffle, isCrossFade },
  } = useSelector(selectAllPlayStatusStore);
  const { song: songInStore, playlist: playlistInStore } =
    useSelector(selectAllSongStore);

  // state
  const [isLoaded, setIsLoaded] = useState(false);
  const [someThingToTriggerError, setSomeThingToTriggerError] = useState(0);
  const [someThingToUpdateHistory, setSomeThingToUpdateHistory] = useState(0);
  const [noLongerPlay, setNoLongerPlay] = useState(true);

  // ref
  const currentIndex = useRef(0);
  const durationRef = useRef(0);
  const durationLineRefWidth = useRef<number>();
  const prevSeekTime = useRef(0);
  const startFadeWhenEnd = useRef(0);
  const prevVolume = useRef(0);

  const isEndOfList = useRef(false);

  const isPlayingNewSong = useRef(true); // for cross fade
  const intervalId = useRef<NodeJS.Timeout>();
  // const history = useRef<string[]>([]);

  // use hook
  const location = useLocation();
  const isInEdit = useMemo(() => location.pathname.includes("edit"), [location]);
  const [_playHistory, setPlayHistory] = useLocalStorage<string[]>("play_history", []);

  const updateProcessLineWidth = () => {
    durationLineRefWidth.current = durationLineRef.current?.offsetWidth;
  };
  useWindowResize(updateProcessLineWidth, [isOpenFullScreen]);

  // use local storage instead of dispatch user info
  const updateHistory = async () => {
    if (admin) return;
    if (!songInStore.id) return;

    const playHistory = JSON.parse(localStorage.getItem("play_history") || "[]");

    let newHistory: string[] = [];
    if (playHistory.length) {
      newHistory = [...playHistory];

      const index = newHistory.find((id) => id === songInStore.id);
      if (index) return;
    }

    newHistory.push(songInStore.id);
    if (newHistory.length > 5) newHistory = newHistory.slice(1);

    setPlayHistory(newHistory);

    await mySetDoc({
      collection: "users",
      data: { play_history: newHistory } as Partial<User>,
      id: userInfo.email,
      msg: ">>> api: set play history",
    });
  };

  const play = () => {
    try {
      audioEle?.play();

      if (!userInfo.email) return;

      if (isPlayingNewSong.current) {
        if (isCrossFade) audioEle.volume = 0;

        isPlayingNewSong.current = false;
        setSomeThingToUpdateHistory(Math.floor(Math.random() * 10));
      }
    } catch (error) {}
  };

  const pause = () => {
    audioEle?.pause();
  };

  const getNewSong = (index: number) => {
    return actuallySongs[index];
  };

  const handlePause = () => {
    dispatch(setPlayStatus({ isPlaying: false }));

    if (intervalId.current) clearInterval(intervalId.current);
  };

  const handlePlaying = () => {
    setNoLongerPlay(false);
    dispatch(setPlayStatus({ isPlaying: true, isWaiting: false, isError: false }));
  };

  const handleWaiting = () => {
    dispatch(setPlayStatus({ isWaiting: true }));
  };

  const handleResetForNewSong = () => {
    const timeProcessLineElement = timeProcessLine.current as HTMLElement;
    setIsLoaded(false);

    if (timeProcessLineElement && currentTimeRef.current && remainingTimeRef.current) {
      currentTimeRef.current.innerText = "00:00";
      remainingTimeRef.current.innerText = "00:00";
      timeProcessLineElement.style.width = "0%";
    }
  };

  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const node = e.target as HTMLElement;
      if (durationLineRefWidth.current && durationRef.current) {
        const clientRect = node.getBoundingClientRect();
        const timeProcessLineElement = timeProcessLine.current as HTMLElement;

        const length = e.clientX - clientRect.left;
        const lengthRatio = length / durationLineRefWidth.current;
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
    [isOpenFullScreen, songInStore, isPlaying]
  );

  const handleNext = useCallback(() => {
    let newIndex = currentIndex.current + 1;
    let newSong: Song;

    if (newIndex < actuallySongs.length) {
      newSong = actuallySongs[newIndex];
    } else {
      newIndex = 0;
      newSong = actuallySongs[0];
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

  const handleFade = (currentTime: number) => {
    const volInStore = JSON.parse(localStorage.getItem("volume") || "1");
    if (currentTime <= 2) {
      const volumeValue = (currentTime / 2) * volInStore;
      // console.log("check val", volumeValue.toFixed(2), volInStore);

      audioEle.volume = volumeValue;
    } else if (currentTime < startFadeWhenEnd.current) {
      const curAudioVolume = audioEle.volume;
      if (curAudioVolume != volInStore) audioEle.volume = volInStore;
      return;
    }

    if (currentTime >= startFadeWhenEnd.current) {
      const volumeValue = ((durationRef.current - currentTime) / 2) * volInStore;
      // console.log("check val", volumeValue.toFixed(2), volInStore);
      audioEle.volume = volumeValue;
    }
  };

  const handleTimeUpdate = () => {
    if (!audioEle) {
      console.log("auto ele is undefined when update time");
      return;
    }

    const currentTime = audioEle?.currentTime;
    const timeProcessLineEle = timeProcessLine.current as HTMLElement;

    if (durationRef.current && currentTime) {
      const newWidth = currentTime / (durationRef.current / 100);

      timeProcessLineEle.style.width = newWidth.toFixed(1) + "%";
    }

    if (currentTimeRef.current) {
      currentTimeRef.current.innerText = handleTimeText(currentTime!) || "00:00";
    }

    if (isCrossFade) handleFade(currentTime);
  };

  const handleEnded = () => {
    const volInStore = JSON.parse(localStorage.getItem("volume") || "1");
    audioEle.volume = volInStore;

    if (isRepeat === "one") {
      return play();
    }

    if (isShuffle) {
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
    const remainingTimeEle = remainingTimeRef.current as HTMLDivElement;
    const audioDuration = audioEle.duration;

    setIsLoaded(true);
    // update text
    durationRef.current = audioDuration;
    remainingTimeEle.innerText = handleTimeText(audioDuration);

    // update control props
    durationLineRefWidth.current = durationLineRef.current?.offsetWidth;
    startFadeWhenEnd.current = audioDuration - 3;

    // case end of list
    if (isEndOfList.current) {
      isEndOfList.current = false;
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    // case in edit page or (no longer play and have queue localStorage )
    if (isInEdit || noLongerPlay) {
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));

      const duration = JSON.parse(localStorage.getItem("duration") || "0");
      // case first time play then update duration in localStorage
      // when user clear song queue or first time access website, these cases don't have duration
      if (noLongerPlay && duration) {
        audioEle.currentTime = duration;
        handleTimeUpdate();

        // case no longer playing and no have queue in localStorage
      } else play();

      setNoLongerPlay(false);
      return;
    }

    // normal click play case
    play();
  };

  const handleError = () => {
    setSomeThingToTriggerError(Math.random());
  };

  // add events listener
  useEffect(() => {
    if (!audioEle) {
      console.log("Audio element is undefined in use control");
      return;
    }

    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePause);
    audioEle.addEventListener("playing", handlePlaying);
    audioEle.addEventListener("waiting", handleWaiting);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePause);
      audioEle.removeEventListener("playing", handlePlaying);
      audioEle.removeEventListener("waiting", handleWaiting);
    };
  }, []);

  // handle when song error
  useEffect(() => {
    if (!someThingToTriggerError) return;
    if (songInStore.name) dispatch(setPlayStatus({ isWaiting: false, isError: true }));
  }, [someThingToTriggerError]);

  // update audio src, currentIndex, reset song
  useEffect(() => {
    if (!audioEle || !songInStore.name) {
      dispatch(setPlayStatus({ isWaiting: false, isPlaying: false }));
      return;
    }

    pause();
    dispatch(setPlayStatus({ isWaiting: true, isError: false, isPlaying: false }));

    audioEle.src = songInStore.song_url;
    currentIndex.current = songInStore.currentIndex;

    if (songInStore.name) {
      document.title = `${songInStore.name} - ${songInStore.singer}`;
    }

    return () => {
      handleResetForNewSong();
      clearInterval(intervalId.current);
      isPlayingNewSong.current = true;
      // setNoLongerPlay(false);
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

  // update song end event
  useEffect(() => {
    if (!audioEle) return;
    audioEle?.addEventListener("ended", handleEnded);

    return () => audioEle?.removeEventListener("ended", handleEnded);
  }, [isRepeat, isShuffle, songInStore.song_in, actuallySongs]);

  // update time update event
  useEffect(() => {
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => audioEle.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isCrossFade]);

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
  }, [isInEdit, songInStore.id, userInfo.like_song_ids, isCrossFade]);

  // update play history
  useEffect(() => {
    if (!someThingToTriggerError) return;

    updateHistory();
  }, [someThingToUpdateHistory]);

  // update duration in local storage
  useEffect(() => {
    prevVolume.current = audioEle.volume;
    if (isPlaying) {
      intervalId.current = setInterval(() => {
        localStorage.setItem("duration", JSON.stringify(audioEle.currentTime));
      }, 3000);
    }

    return () => clearInterval(intervalId.current);
  }, [isPlaying]);

  // confirm reload
  useEffect(() => {
    if (noLongerPlay) return;

    const handleWindowReload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = true;
    };

    window.addEventListener("beforeunload", handleWindowReload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowReload);
    };
  }, [noLongerPlay]);

  return { handleNext, handlePrevious, handleSeek, play, pause, isLoaded };
}
