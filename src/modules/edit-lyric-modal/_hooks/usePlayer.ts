import { useAudioControl } from "@/hooks";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import createKeyFrame from "@/utils/createKeyFrame";
import { useEffect } from "react";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function usePlayer({ audioEle }: Props) {
  const {
    eleRefs,
    actuallyEndRef,
    actuallyStartRef,
    tempActuallyStartRef,
    wordsRatioRef,
    mergedGrowListRef,
    status,
    setStatus,
  } = useLyricEditorContext();

  const { play, pause, statusRef } = useAudioControl({
    audioEle,
    statusFromParent: status,
    setStatusFromParent: setStatus,
  });

  const { overlayRef } = eleRefs;

  const _pause = () => {
    pause();

    if (overlayRef.current) overlayRef.current.style.animation = "none";
  };

  const _play = () => {
    audioEle.currentTime = actuallyStartRef.current;
    // except case changing end time
    if (!tempActuallyStartRef.current) {
      if (overlayRef.current) {
        const name = createKeyFrame(mergedGrowListRef.current, wordsRatioRef.current);
        overlayRef.current.style.animation = `${name} ${(
          (actuallyEndRef.current - actuallyStartRef.current) /
          audioEle.playbackRate
        ).toFixed(2)}s linear`;
      }
    }

    play();
  };

  const handlePlayPause = () => {
    if (statusRef.current === "paused") _play();
    else {
      _pause();
    }
  };

  const handleTimeUpdate = () => {
    if (+audioEle.currentTime.toFixed(1) >= actuallyEndRef.current) return _pause();
  };

  useEffect(() => {
    if (!audioEle) return;

    audioEle.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEle.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return { handlePlayPause, _pause, _play, status };
}
