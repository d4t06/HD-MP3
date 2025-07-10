import { useEffect, type RefObject } from "react";
import { usePlayerContext } from "../_components/PlayerContext";
import { getLinearBg } from "@/utils/getLinearBg";

type Props = {
  audioEle: HTMLAudioElement;
  progressLineRef?: RefObject<HTMLDivElement | null>;
};

export default function useAudioControl({ audioEle, progressLineRef }: Props) {
  const { status, setStatus, statusRef } = usePlayerContext();

  const play = () => {
    try {
      audioEle.play();
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

  const updateProgress = (time?: number) => {
    if (!audioEle) return;

    const _time = time || audioEle.currentTime;

    const progress = +((_time / audioEle.duration) * 100).toFixed(1);

    if (progressLineRef?.current)
      progressLineRef.current.style.background = getLinearBg("#fff", progress);
  };

  const handleTimeUpdate = () => {
    updateProgress();
  };

  const seek = (time: number) => {
    audioEle.currentTime = time;
    updateProgress(time);

    if (status !== "playing") play();
  };

  const handleSeek = (e: MouseEvent) => {
    const node = e.target as HTMLElement;

    if (progressLineRef?.current) {
      const clientRect = node.getBoundingClientRect();

      const length = e.clientX - clientRect.left;
      const lengthRatio = length / progressLineRef.current!.offsetWidth;
      const newSeekTime = Math.round(lengthRatio * audioEle.duration);

      seek(newSeekTime);
    }
  };

  // const handleLoaded = () => {


  //   console.log('loaded')

  //   setStatus("paused");
  // };

  // add events listener
  useEffect(() => {
    if (!audioEle) return;

    audioEle.addEventListener("pause", handlePaused);
    // audioEle.addEventListener("loadeddata", handleLoaded);
    audioEle.addEventListener("playing", handlePlaying);

    if (progressLineRef?.current) {
      audioEle.addEventListener("timeupdate", handleTimeUpdate);
      progressLineRef?.current.addEventListener("click", handleSeek);
    }

    return () => {
      // audioEle.removeEventListener("loadeddata", handleLoaded);

      audioEle.removeEventListener("pause", handlePaused);
      audioEle.removeEventListener("playing", handlePlaying);

      if (progressLineRef?.current) {
        audioEle.removeEventListener("timeupdate", handleTimeUpdate);
        progressLineRef?.current.removeEventListener("click", handleSeek);
      }
    };
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  return {
    play,
    pause,
    seek,
    handlePlayPause,
  };
}
