import { useEffect, useState } from "react";

type Props = {
   audioEle: HTMLAudioElement;
};

type Status = "playing" | "paused" | "waiting" | "error";

export default function useAudioControl({ audioEle }: Props) {
   const [status, setStatus] = useState<Status>("paused");
   const [isClickPlay, setIsClickPlay] = useState(false);

   const play = () => {
      try {
         audioEle?.play();
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

   const handleError = () => {
      setStatus("error");
   };

   const seek = (time: number) => {
      audioEle.currentTime = time;
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
      // audioEle.addEventListener("waiting", handleWaiting);

      return () => {
         audioEle.removeEventListener("error", handleError);
         audioEle.removeEventListener("pause", handlePaused);
         audioEle.removeEventListener("playing", handlePlaying);
      };
   }, []);

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
