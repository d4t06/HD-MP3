import { useThemeContext } from "@/stores";
import { formatTime } from "@/utils/appHelpers";
import { getLinearBg } from "@/utils/getLinearBg";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";

export type Status =
  | "playing"
  | "paused"
  | "waiting"
  | "loading"
  | "error"
  | "idle";

type Props = {
  audioEle: HTMLAudioElement;
  baseColor?: string;
  color?: string;
  statusFromParent?: Status;
  setStatusFromParent?: Dispatch<SetStateAction<Status>>;
  statusRefFromParent?: MutableRefObject<Status>
};

export default function useAudioControl({
  audioEle,
  baseColor,
  color,
  setStatusFromParent,
  statusFromParent,
  statusRefFromParent
}: Props) {
  const { theme } = useThemeContext();
  const [localStatus, setLocalStatus] = useState<Status>("paused");
  const [isClickPlay, setIsClickPlay] = useState(false);

  const status = statusFromParent || localStatus;
  const setStatus = setStatusFromParent || setLocalStatus;

  const themeCode = useRef("");
  const statusRef = useRef<Status>(status);

  const progressLineRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  const _statusRef = statusRefFromParent || statusRef

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

  const handleLoaded = () => {
    setStatus("paused");

    if (durationRef.current) {
      durationRef.current.innerText = formatTime(audioEle.duration);
    }
  };

  const updateProgress = (progress?: number) => {
    if (!audioEle) return;

    const _progress = +(
      progress || (audioEle.currentTime / audioEle.duration) * 100
    ).toFixed(1);

    if (currentTimeRef.current)
      currentTimeRef.current.innerText = formatTime(audioEle.currentTime);

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
    audioEle.addEventListener("loadedmetadata", handleLoaded);

    if (progressLineRef?.current) {
      progressLineRef?.current.addEventListener("click", handleSeek);

      audioEle.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      audioEle.removeEventListener("error", handleError);
      audioEle.removeEventListener("pause", handlePaused);
      audioEle.removeEventListener("playing", handlePlaying);
      audioEle.removeEventListener("loadedmetadata", handleLoaded);

      if (progressLineRef?.current) {
        audioEle.removeEventListener("timeupdate", handleTimeUpdate);
        progressLineRef?.current.removeEventListener("click", handleSeek);
      }
    };
  }, [audioEle]);

  // update time line background color
  useEffect(() => {
    themeCode.current = theme.content_code;

    if (status !== "playing") updateProgress();
  }, [theme]);

  useEffect(() => {
    _statusRef.current = status;
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
    progressLineRef,
    currentTimeRef,
    durationRef,
  };
}
