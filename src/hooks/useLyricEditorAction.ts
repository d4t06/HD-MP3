import { mySetDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useEditLyricContext } from "@/stores/EditLyricContext";
import { setLocalStorage } from "@/utils/appHelpers";

type Props = {
  audioEle: HTMLAudioElement;
  isClickPlay: boolean;
  song?: Song;
};

export function useLyricEditorAction({ audioEle, isClickPlay, song }: Props) {
  const {
    start,
    baseLyricArr,
    lyrics,
    setLyrics,
    setIsChanged,
    setIsFetching,
    baseLyric,
  } = useEditLyricContext();

  const { setErrorToast, setSuccessToast } = useToastContext();

  const isFinish = lyrics.length >= baseLyricArr.length;

  const isEnableAddBtn = isClickPlay && !!baseLyricArr.length && !isFinish;

  const addLyric = () => {
    if (!audioEle || !baseLyricArr.length || isFinish) return;
    const currentTime = +audioEle.currentTime.toFixed(1);

    if (start.current === currentTime) return; // prevent double click

    const text = baseLyricArr[lyrics.length];
    const lyric: RealTimeLyric = {
      start: start.current, // end time of prev lyric
      text,
      end: currentTime,
    };

    start.current = currentTime; // update start for next lyric

    setLyrics((prev) => [...prev, lyric]);

    setIsChanged(true);
  };

  const removeLyric = () => {
    if (!lyrics.length) return;

    if (audioEle) {
      const prevStart = lyrics[lyrics.length - 1].start;

      start.current = prevStart;
      audioEle.currentTime = prevStart;

      setLyrics((prev) => prev.slice(0, -1));
      // setCurrentLyricIndex((prev) => prev - 1);
      setIsChanged(true);
    }
  };

  const submit = async () => {
    try {
      setIsFetching(true);
      if (!song) return;

      const newSongLyric = {
        real_time: JSON.stringify(lyrics),
        base: baseLyric,
      };

      await mySetDoc({
        collectionName: "lyrics",
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

  return {
    addLyric,
    removeLyric,
    isEnableAddBtn,
    submit,
  };
}
