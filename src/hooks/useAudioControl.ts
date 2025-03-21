import { useThemeContext } from "@/stores";
import { getLinearBg } from "@/utils/getLinearBg";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

export type Status = "playing" | "paused" | "waiting" | "error";

type Props = {
  audioEle: HTMLAudioElement;
  progressLineRef?: RefObject<HTMLDivElement>;
  baseColor?: string;
  color?: string;
  statusFromParent?: Status;
  setStatusFromParent?: Dispatch<SetStateAction<Status>>;
};

export default function useAudioControl({
  audioEle,
  baseColor,
  color,
  progressLineRef,
  setStatusFromParent,
  statusFromParent,
}: Props) {
  const { theme } = useThemeContext();
  const [localStatus, setLocalStatus] = useState<Status>("paused");
  const [isClickPlay, setIsClickPlay] = useState(false);

  const status = statusFromParent || localStatus;
  const setStatus = setStatusFromParent || setLocalStatus;

  const themeCode = useRef("");
  const statusRef = useRef<Status>(status);

  const play = () => {
    try {
      audioEle.play();
      setIsClickPlay(true);
    } catch (error) {}
  };

  const pause = () => {
    audioEle?.pause();
    handlePaused();
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
    if (!audioEle) return;

    const _progress = +(
      progress || (audioEle.currentTime / audioEle.duration) * 100
    ).toFixed(1);

    if (progressLineRef?.current)
      progressLineRef.current.style.background = getLinearBg(
        color || themeCode.current,
        _progress,
        baseColor,
      );
  };

  const handleTimeUpdate = () => {
    const currentTime = audioEle.currentTime;
    const ratio = currentTime / (audioEle.duration / 100);

    updateProgress(+ratio.toFixed(1));
  };

  const handleError = () => {
    console.log("error");

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
    if (!audioEle) return;

    audioEle.addEventListener("error", handleError);
    audioEle.addEventListener("pause", handlePaused);
    audioEle.addEventListener("playing", handlePlaying);

    if (progressLineRef?.current)
      audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePaused);
      audioEle.removeEventListener("playing", handlePlaying);
      if (progressLineRef?.current)
        audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioEle]);

  // update time line background color
  useEffect(() => {
    themeCode.current = theme.content_code;

    if (status !== "playing") updateProgress();
  }, [theme]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  return {
    play,
    pause,
    seek,
    handlePlayPause,
    status,
    forward,
    backward,
    isClickPlay,
    statusRef,
  };
}
