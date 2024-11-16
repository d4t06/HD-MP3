import { useEditLyricContext } from "@/store/EditLyricContext";
import createKeyFrame from "@/utils/createKeyFrame";
import { ElementRef, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import useAudioControl from "./useAudioControl";
import { getWidthList } from "@/utils/getWidthList";

export default function useEditLyricModal() {
  const { updateLyric, setIsChanged, lyrics, selectLyricIndex } = useEditLyricContext();

  if (selectLyricIndex === undefined) throw new Error("");

  const [words, setWords] = useState<string[]>([]);
  const [growList, setGrowList] = useState<number[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [hadAudioEle, setHadAudioEle] = useState(false);

  const textRef = useRef<ElementRef<"textarea">>(null);
  const overlayRef = useRef<ElementRef<"div">>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const endTimeRangeRef = useRef<ElementRef<"input">>(null);
  const startTimeRangeRef = useRef<ElementRef<"input">>(null);
  const actuallyEndRef = useRef(0);
  const actuallyStartRef = useRef(0);
  const startRefText = useRef<ElementRef<"span">>(null);
  const endRefText = useRef<ElementRef<"span">>(null);

  const tempWordRef = useRef<ElementRef<"div">>(null);
  const wordWidthList = useRef<number[]>([]);
  const growListRef = useRef<number[]>([]);
  const isChanged = useRef(false);

  const currentLyric = useMemo(
    () => lyrics[selectLyricIndex],
    [selectLyricIndex, lyrics]
  );

  const { play, pause, status, statusRef } = useAudioControl({
    audioEle: audioRef.current!,
  });

  const handleUpdateLyricText = (e: FormEvent) => {
    if (!selectLyricIndex) return;

    e.preventDefault();

    if (!textRef.current) return;

    updateLyric(selectLyricIndex, { text: textRef.current.value });
  };

  const updateLyricTune = () => {

   console.log('update tune');
   

    const newTune: LyricTune = {
      start: actuallyStartRef.current,
      end: actuallyEndRef.current,
      grow: growList.join("_"),
    };
    updateLyric(selectLyricIndex, { tune: newTune });

    setIsChanged(true);
  };

  type Range = {
    variant: "range";
    value: number;
    index: number;
  };

  type Button = {
    variant: "button";
    action: "minus" | "plus";
    index: number;
  };

  const handleGrowWord = (props: Range | Button) => {
    if (props.variant === "range" && props.value < 1) return;

    isChanged.current = true;

    setGrowList((prev) => {
      const _prev = [...prev];

      let newValue = _prev[props.index];

      switch (props.variant) {
        case "range":
          newValue = props.value;
          break;
        case "button":
          newValue = +(
            props.action === "minus" ? newValue - 0.2 : newValue + 0.2
          ).toFixed(1);
      }

      _prev[props.index] = newValue;

      return _prev;
    });
  };

  const _pause = () => {
    pause();

    if (!overlayRef.current) return;

    overlayRef.current.style.animation = "none";
  };

  const _play = () => {
    if (!audioRef.current || !overlayRef.current) return;
    const audioEle = audioRef.current;

    audioEle.currentTime = actuallyStartRef.current - 0.3;

    const name = createKeyFrame(growListRef.current, wordWidthList.current);

    overlayRef.current.style.animation = `${name} ${(
      (actuallyEndRef.current - actuallyStartRef.current) /
      audioRef.current.playbackRate
    ).toFixed(1)}s linear`;

    play();
  };

  const handlePlayPause = () => {
    if (statusRef.current === "paused") _play();
    else {
      _pause();
    }
  };

  const setEndPoint = (time: number) => {
    const newEnd = +time.toFixed(1);
    isChanged.current = true;

    actuallyEndRef.current = newEnd;
    if (endRefText.current) {
      endRefText.current.textContent = `${newEnd} / ${currentLyric.end}`;
    }
  };

  const setStartPoint = (time: number) => {
    const newStart = +time.toFixed(1);
    isChanged.current = true;

    actuallyStartRef.current = newStart;
    if (startRefText.current) {
      startRefText.current.textContent = `${currentLyric.start} / ${newStart}`;
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    if (+audioRef.current.currentTime.toFixed(1) >= actuallyEndRef.current)
      return _pause();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      handlePlayPause();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hadAudioEle]);

  useEffect(() => {
    setHadAudioEle(true);
  }, []);

  useEffect(() => {
    if (!words.length || !tempWordRef.current) return;

    const list = getWidthList(tempWordRef.current);

    wordWidthList.current = list;
  }, [words]);

  useEffect(() => {
    growListRef.current = growList;
  }, [growList]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    audioRef.current.playbackRate = 1.2;

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [hadAudioEle]);

  useEffect(() => {
    const text = currentLyric.text.trim();

    const _words = text.split(" ").filter((w) => w);
    setWords(_words);

    const _growList = currentLyric?.tune
      ? currentLyric.tune.grow.split("_").map((v) => +v)
      : [];
    _words.forEach((_w, index) => {
      if (typeof _growList[index] !== "number") _growList[index] = 1;
    });

    setGrowList(_growList);

    if (
      endRefText.current &&
      startRefText.current &&
      startTimeRangeRef.current &&
      endTimeRangeRef.current
    ) {
      actuallyStartRef.current = currentLyric?.tune
        ? currentLyric.tune.start
        : currentLyric.start;
      startRefText.current.innerText = `${currentLyric.start} / ${actuallyStartRef.current}`;

      startTimeRangeRef.current.max = currentLyric.end + "";
      startTimeRangeRef.current.value = actuallyStartRef.current + "";

      actuallyEndRef.current = currentLyric?.tune
        ? currentLyric.tune.end
        : currentLyric.end;
      endRefText.current.innerText = `${actuallyEndRef.current} / ${currentLyric.end}`;

      endTimeRangeRef.current.max = currentLyric.end + "";
      endTimeRangeRef.current.value = actuallyEndRef.current + "";
    }
  }, [selectLyricIndex]);

  return {
    refs: {
      overlayRef,
      tempWordRef,
      textRef,
      endTimeRangeRef,
      startTimeRangeRef,
      startRefText,
      endRefText,
      audioRef,
      isChanged,
    },
    pause,
    setStartPoint,
    words,
    isEdit,
    setIsEdit,
    handlePlayPause,
    growList,
    handleGrowWord,
    setEndPoint,
    handleUpdateLyricText,
    status,
    updateLyricTune,
    currentLyric,
  };
}
