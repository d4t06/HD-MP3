import { mySetDoc } from "@/services/firebaseService";
import { useToast } from "@/store";
import { useEditLyricContext } from "@/store/EditSongLyricContext";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { useEffect, useState } from "react";

type Props = {
  audioEle: HTMLAudioElement;
  isClickPlay: boolean;
  song?: Song;
};

export function useLyricEditorAction({ audioEle, isClickPlay, song }: Props) {
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(100);

  const {
    start,
    baseLyricArr,
    currentLyricIndex,
    lyrics,
    setCurrentLyricIndex,
    setLyrics,
    setIsChanged,
    setIsFetching,
    baseLyric,
  } = useEditLyricContext();

  const { setErrorToast, setSuccessToast } = useToast();

  const isFinish = lyrics.length >= baseLyricArr.length;

  const isEnableAddBtn = isClickPlay && !!baseLyricArr.length && !isFinish;

  const addLyric = () => {
    if (!audioEle || !baseLyricArr.length || isFinish) return;
    const currentTime = +audioEle.currentTime.toFixed(1);

    if (start.current === currentTime) return; // prevent double click

    const text = baseLyricArr[currentLyricIndex];
    const lyric: RealTimeLyric = {
      start: start.current, // end time of prev lyric
      text,
      end: currentTime,
    };

    start.current = currentTime; // update start for next lyric

    setLyrics([...lyrics, lyric]);
    setCurrentLyricIndex(currentLyricIndex + 1);

    setIsChanged(true);
  };

  const removeLyric = () => {
    if (currentLyricIndex <= 0) return;

    if (audioEle) {
      const prevStart = lyrics[currentLyricIndex - 1].start;

      start.current = prevStart;
      audioEle.currentTime = prevStart;

      setLyrics((prev) => prev.slice(0, -1));
      setCurrentLyricIndex((prev) => prev - 1);
      setIsChanged(true);
    }
  };

  const changeSpeed = (speed: number) => {
    audioEle.playbackRate = speed;
    setSpeed(speed);
    setLocalStorage("edit_lyric_audio_speed", speed);
  };

  const changeVolume = (value: number) => {
    audioEle.volume = value / 100;
    setVolume(value);
    setLocalStorage("edit_lyric_audio_volume", value);
  };

  const submit = async () => {
    try {
      setIsFetching(true);
      if (!song) return;

      const newSongLyric = {
        real_time: lyrics,
        base: baseLyric,
      };

      await mySetDoc({
        collection: "lyrics",
        data: newSongLyric,
        id: song.id,
      }).catch(() => {
        throw { ...newSongLyric, id: song.id };
      });

      setSuccessToast("Add lyric successful");
      setIsChanged(false);

      setLocalStorage("temp-lyric", "");
    } catch (error: any) {
      setLocalStorage("temp-lyric", {
        ...error,
        real_time: JSON.stringify(error.real_time),
      } as SongLyric);

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  // load localStorage
  useEffect(() => {
    const { edit_lyric_audio_speed, edit_lyric_audio_volume } = getLocalStorage();

    if (edit_lyric_audio_speed) {
      setSpeed(+edit_lyric_audio_speed);
      audioEle.playbackRate = +edit_lyric_audio_speed;
    }
    if (edit_lyric_audio_volume) {
      setVolume(+edit_lyric_audio_volume);
      audioEle.volume = +edit_lyric_audio_volume / 100;
    }
  }, []);

  return {
    addLyric,
    removeLyric,
    isEnableAddBtn,
    speed,
    volume,
    changeSpeed,
    changeVolume,
    submit,
  };
}
