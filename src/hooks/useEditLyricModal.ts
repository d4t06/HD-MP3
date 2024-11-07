import { useEditLyricContext } from "@/store/EditLyricContext";
import createKeyFrame from "@/utils/createKeyFrame";
import { ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import useAudioControl from "./useAudioControl";
import { getWidthList } from "@/utils/getWidthList";

type Props = {
  lyric: RealTimeLyric;
  index: number;
};

export default function useEditLyricModal({ lyric, index }: Props) {
  const { updateLyric, setIsChanged } = useEditLyricContext();

  const [words, setWords] = useState<string[]>([]);
  const [growList, setGrowList] = useState<number[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [hadAudioEle, setHadAudioEle] = useState(false);

  const textRef = useRef<ElementRef<"textarea">>(null);
  const overlayRef = useRef<ElementRef<"div">>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const endTimeRangeRef = useRef<ElementRef<"input">>(null);
  const startTimeRangeRef = useRef<ElementRef<"input">>(null);
  const actuallyEndRef = useRef(lyric.end);
  const actuallyStartRef = useRef(lyric.start);
  const startRefText = useRef<ElementRef<"span">>(null);
  const endRefText = useRef<ElementRef<"span">>(null);

  const tempWordRef = useRef<ElementRef<"div">>(null);
  const wordWidthList = useRef<number[]>([]);

  const { play, pause, status } = useAudioControl({ audioEle: audioRef.current! });

  const handleUpdateLyricText = (e: FormEvent) => {
    e.preventDefault();

    if (!textRef.current) return;

    updateLyric(index, { text: textRef.current.value });
  };

  const updateLyricTune = () => {
    const newTune: LyricTune = {
      start: actuallyStartRef.current,
      end: actuallyEndRef.current,
      grow: growList.join("_"),
    };
    updateLyric(index, { tune: newTune });

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

    const name = createKeyFrame(growList, wordWidthList.current);

    overlayRef.current.style.animation = `${name} ${(
      (actuallyEndRef.current - actuallyStartRef.current - 0.3) /
      1.2
    ).toFixed(1)}s linear`;

    play();
  };

  const handlePlayPause = () => {
    if (status === "paused") _play();
    else {
      _pause();
    }
  };

  const setEndPoint = (time: number) => {
    const newEnd = +time.toFixed(1);

    actuallyEndRef.current = newEnd;
    if (endRefText.current) {
      endRefText.current.textContent = `${newEnd} / ${lyric.end}`;
    }
  };

  const setStartPoint = (time: number) => {
    const newStart = +time.toFixed(1);

    actuallyStartRef.current = newStart;
    if (startRefText.current) {
      startRefText.current.textContent = `${lyric.start} / ${newStart}`;
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    if (+audioRef.current.currentTime.toFixed(1) >= actuallyEndRef.current)
      return _pause();
  };

  useEffect(() => {
    setHadAudioEle(true);
  }, []);

  useEffect(() => {
    if (!words.length || !tempWordRef.current) return;

    const list = getWidthList(tempWordRef.current);

    wordWidthList.current = list;
  }, [words]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    audioRef.current.playbackRate = 1.2;

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [hadAudioEle]);

  useEffect(() => {
    const text = lyric.text.trim();

    const _words = text.split(" ").filter((w) => w);
    setWords(_words);

    const _growList = lyric?.tune ? lyric.tune.grow.split("_").map((v) => +v) : [];
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
      actuallyStartRef.current = lyric?.tune ? lyric.tune.start : lyric.start;
      startRefText.current.innerText = `${lyric.start} / ${actuallyStartRef.current}`;

      startTimeRangeRef.current.max = lyric.end + "";
      startTimeRangeRef.current.value = actuallyStartRef.current + "";

      actuallyEndRef.current = lyric?.tune ? lyric.tune.end : lyric.end;
      endRefText.current.innerText = `${actuallyEndRef.current} / ${lyric.end}`;

      endTimeRangeRef.current.max = lyric.end + "";
      endTimeRangeRef.current.value = actuallyEndRef.current + "";
    }
  }, [lyric]);

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
    },
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
  };
}
