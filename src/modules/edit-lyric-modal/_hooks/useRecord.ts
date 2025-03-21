import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function useRecord({ audioEle }: Props) {
  const { currentSplitWords } = useEditLyricContext();
  const {
    eventRefs,
    playerRef,
    isChangedRef,
    tabProps: { tab, setTab },
    setGrowList,
    actuallyStartRef,
  } = useLyricEditorContext();

  const [isRecording, setIsRecording] = useState(false);
  const [localGrowList, setLocalGrowList] = useState<number[]>([]);

  const startRef = useRef(Date.now());
  const isCallPlay = useRef(false);
  const isPressedDown = useRef(false);

  const addRecord = () => {
    const grow = +(+((Date.now() - startRef.current) / 1000).toFixed(2) + 1).toFixed(2);
    setLocalGrowList((prev) => [...prev, grow]);
  };

  const record = () => {};

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

  const buttonProps: HTMLAttributes<HTMLButtonElement> = {
    // onMouseUp: handleKeyUp,
    // onMouseDown: handleKeyDown,
  };

  const clear = () => {
    playerRef.current?.pause();
    isCallPlay.current = false;
    setLocalGrowList([]);
    setIsRecording(false);
  };

  const handleFinish = () => {
    setGrowList(localGrowList);
    isChangedRef.current = true;

    setTab("Edit");

    clear();
  };

  useEffect(() => {
    // growListLengthRef.current = localGrowList.length;

    if (localGrowList.length === currentSplitWords.length) {
      handleFinish();
    }
  }, [localGrowList]);

  useEffect(() => {
    if (tab !== "Record") return;

    playerRef.current?.pause();

    eventRefs.playWhenSpaceRef.current = false;
    eventRefs.moveArrowToGrowRef.current = false;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    audioEle.currentTime = actuallyStartRef.current;
    // audioEle.addEventListener("pause", handleFinish);

    return () => {
      playerRef.current?.pause();

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // audioEle.removeEventListener("pause", handleFinish);
    };
  }, [tab]);

  return {
    record,
    localGrowList,
    buttonProps,
    clear,
    isRecording,
  };
}
