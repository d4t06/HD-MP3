import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { mergeGrow } from "@/utils/mergeGrow";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function useRecord({ audioEle }: Props) {
  const {
    playerRef,
    isChangedRef,
    tabProps: { tab, setTab },
    setGrowList,
    cut,
    actuallyStartRef,
    mergedGrowListRef,
    currentSplitWords,
    currentWords,
  } = useLyricEditorContext();

  const [isRecording, setIsRecording] = useState(false);
  const [localGrowList, setLocalGrowList] = useState<number[]>([]);

  const startRef = useRef(Date.now());
  const isCallPlay = useRef(false);
  const isPressedDown = useRef(false);

  const addRecord = () => {
    const grow = +((Date.now() - startRef.current) / 1000).toFixed(1);
    setLocalGrowList((prev) => [...prev, grow]);
  };

  const handleHold = () => {
    startRef.current = Date.now();

    if (!isCallPlay.current) {
      isCallPlay.current = true;
      playerRef.current?.play();

      setIsRecording(true);
    }
  };

  const handleRelease = () => {
    if (!isCallPlay.current) return;

    addRecord();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      if (!isPressedDown.current) {
        e.preventDefault();

        isPressedDown.current = true;
        handleHold();
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();

      handleRelease();
      isPressedDown.current = false;
    }
  };

  const handlePointDown = () => {
    handleHold();
  };

  const handlePointUp = () => {
    handleRelease();
  };

  const buttonProps: HTMLAttributes<HTMLButtonElement> = {
    onPointerDown: handlePointDown,
    onPointerUp: handlePointUp,
  };

  const clear = () => {
    playerRef.current?.pause();
    isCallPlay.current = false;
    setLocalGrowList([]);
    setIsRecording(false);
  };

  const handleFinish = () => {
    isChangedRef.current = true;

    setGrowList(localGrowList);
    const mergedGrow = mergeGrow(currentWords, cut, localGrowList);
    mergedGrowListRef.current = mergedGrow;

    setTab("Edit");
    clear();
  };

  useEffect(() => {
    if (localGrowList.length === currentSplitWords.length) {
      handleFinish();
    }
  }, [localGrowList]);

  useEffect(() => {
    if (tab !== "Record") return;

    playerRef.current?.pause();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    audioEle.currentTime = actuallyStartRef.current;

    return () => {
      playerRef.current?.pause();

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [tab]);

  return {
    localGrowList,
    buttonProps,
    clear,
    isRecording,
  };
}
