import { usePlayerContext } from "@/stores";
import { selectAllPlayStatusStore, setPlayStatus } from "@/stores/redux/PlayStatusSlice";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePlayerAction from "./usePlayerAction";

export default function useCountDown() {
  const dispatch = useDispatch();

  const { audioRef, firstTimeSongLoaded } = usePlayerContext();

  const { playStatus, countDown } = useSelector(selectAllPlayStatusStore);

  const { handlePlayPause } = usePlayerAction();

  const countDownRef = useRef(0);

  const handleSongEnd = () => {

console.log('song end')

    setLocalStorage("timer", countDownRef.current - 1);
    return dispatch(setPlayStatus({ countDown: countDownRef.current - 1 }));
  };

  // load localStorage
  useEffect(() => {
    const timer = getLocalStorage()["timer"] || 0;
    dispatch(setPlayStatus({ countDown: timer }));
  }, []);

  // add audio event
  useEffect(() => {
    if (!countDown || !audioRef.current) return;

    setLocalStorage("is_timer", true);
    audioRef.current.addEventListener("ended", handleSongEnd);

    if (!firstTimeSongLoaded.current) {
      setLocalStorage("timer", countDown);
      if (playStatus === "paused") handlePlayPause();
    }

    return () => {
      audioRef.current?.removeEventListener("ended", handleSongEnd);
    };
  }, [!!countDown]);

  // handle user click
  // useEffect(() => {
  //   /** loadLocalStorage:  loadStorage() => setActive(), setCountDown() */
  //   /** manual: user choose timer => setIsActive() => setCountDown() */
  //   if (!isActive) return;

  //   if (!countDown) {
  //     setLocalStorage("timer", countDown);
  //     if (playStatus === "paused") controlRef.current?.handlePlayPause();
  //   }
  // }, [isActive]);

  useEffect(() => {
    countDownRef.current = countDown;
  }, [countDown]);
}
