import { useEditLyricContext } from "@/store/EditSongLyricContext";
import createKeyFrame from "@/utils/createKeyFrame";
import { ElementRef, FormEvent, useEffect, useRef, useState } from "react";
import useAudioControl from "./useAudioControl";

type Props = {
  lyric: RealTimeLyric;
  index: number;
};

export default function useEditLyricModal({ lyric, index }: Props) {
  const { updateLyric } = useEditLyricContext();

  const [words, setWords] = useState<string[]>([]);
  const [growList, setGrowList] = useState<number[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [hadAudioEle, setHadAudioEle] = useState(false);

  const textRef = useRef<ElementRef<"textarea">>(null);
  const overlayRef = useRef<ElementRef<"div">>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const timeRangeRef = useRef<ElementRef<"input">>(null);
  const actuallyEndRef = useRef(lyric.end);
  const endRefText = useRef<ElementRef<"span">>(null);

  const { play, pause, status } = useAudioControl({ audioEle: audioRef.current! });

  const handleUpdateLyricText = (e: FormEvent) => {
    e.preventDefault();

    if (!textRef.current) return;

    updateLyric(index, textRef.current.value);
  };

  const handleGrowWord = (action: "plus" | "minus", index: number) => {
    if (growList[index] === 1 && action === "minus") return;

    setGrowList((prev) => {
      const _prev = [...prev];

      _prev[index] = +(
        action === "minus" ? _prev[index] - 0.2 : _prev[index] + 0.2
      ).toFixed(1);

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

    audioEle.currentTime = lyric.start;
    createKeyFrame(growList);

    overlayRef.current.style.animation = `lyric ${
      actuallyEndRef.current - lyric.start
    }s linear`;

    play();
  };

  const setEndPoint = (time: number) => {
    const newEnd = +time.toFixed(1);

    actuallyEndRef.current = newEnd;
    if (endRefText.current) {
      endRefText.current.textContent = `${newEnd} / ${lyric.end}`;
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
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [hadAudioEle]);

  useEffect(() => {
    const text = lyric.text.trim();

    const _words = text.split(" ").filter((w) => w);
    setWords(_words);

    const parseTune = JSON.parse(lyric?.tune || "{}") as Partial<LyricTune>;

    const _growList = parseTune?.grow ? parseTune.grow.split("_").map((v) => +v) : [];
    _words.forEach((_w, index) => {
      if (typeof _growList[index] !== "number") _growList[index] = 1;
    });

    setGrowList(_growList);

    if (endRefText.current) {
      actuallyEndRef.current = parseTune?.end || lyric.end;
      endRefText.current.innerText = `${actuallyEndRef.current} / ${lyric.end}`;
    }
  }, [lyric]);

  useEffect(() => {
    if (timeRangeRef.current) {
      timeRangeRef.current.value = lyric.end + "";
    }
  }, []);

  return {
    overlayRef,
    audioRef,
    textRef,
    timeRangeRef,
    endRefText,
    words,
    isEdit,
    setIsEdit,
    _play,
    growList,
    handleGrowWord,
    setEndPoint,
    handleUpdateLyricText,
    status,
  };
}
