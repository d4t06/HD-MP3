import { useTheme } from "@/store";
import { getLinearBg } from "@/utils/appHelpers";
import { RefObject, useEffect, useRef, useState } from "react";

type Props = {
  audioEle: HTMLAudioElement;
  progressLineRef?: RefObject<HTMLDivElement>;
};

type Status = "playing" | "paused" | "waiting" | "error";

export default function useAudioControl({ audioEle, progressLineRef }: Props) {
  const { theme } = useTheme();
  const [status, setStatus] = useState<Status>("paused");
  const [isClickPlay, setIsClickPlay] = useState(false);

  const themeCode = useRef("");

  const play = () => {
    try {
      audioEle.play();
      setIsClickPlay(true);
    } catch (error) {}
  };

  const pause = () => {
    audioEle?.pause();
  };

  const handlePlayPause = () => {
    status === "playing" ? pause() : status === "paused" && play();
  };

  const handlePlaying = () => {
    setStatus("playing");
  };

  const handlePaused = () => {
    setStatus("paused");
  };

  const updateProgress = (progress?: number) => {
    const _progress = +(
      progress || (audioEle.currentTime / audioEle.duration) * 100
    ).toFixed(1);

    if (progressLineRef?.current)
      progressLineRef.current.style.background = getLinearBg(
        themeCode.current,
        _progress
      );
  };

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;
    const ratio = currentTime / (audioEle.duration / 100);

    updateProgress(+ratio.toFixed(1));
  };

  const handleError = () => {


    console.log('error');
    

    setStatus("error");
  };

  const seek = (time: number) => {
    audioEle.currentTime = time;
    updateProgress();

    if (status !== "playing") play();
  };

  const forward = (second: number) => {
    audioEle.currentTime = audioEle.currentTime + second;
  };
  const backward = (second: number) => {
    audioEle.currentTime = audioEle.currentTime - second;
  };

  // add events listener
  useEffect(() => {
    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePaused);
    audioEle.addEventListener("playing", handlePlaying);
    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePaused);
      audioEle.removeEventListener("playing", handlePlaying);
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // update time line background color
  useEffect(() => {
    themeCode.current = theme.content_code;

    if (status !== "playing") updateProgress();
  }, [theme]);

  return {
    play,
    pause,
    seek,
    handlePlayPause,
    status,
    forward,
    backward,
    isClickPlay,
  };
}
