import { db } from "@/firebase";
import { useToastContext } from "@/stores";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useEditLyricContext } from "../_components/EditLyricContext";
import { initLyricObject } from "@/utils/factory";

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
    if (!audioEle || !baseLyricArr.length || isFinish || !song) return;

    const currentTime = +audioEle.currentTime.toFixed(1);
    if (start.current === currentTime) return; // prevent double click

    const text = baseLyricArr[lyrics.length];
    const lyric = initLyricObject({
      start: start.current,
      end: currentTime,
      text,
    });

    start.current = currentTime; // update start for next lyric

    setLyrics((prev) => [...prev, lyric]);

    // adding the 2 last lyric
    if (baseLyricArr.length === lyrics.length + 2) {
      const text = baseLyricArr[baseLyricArr.length - 1];
      const lyric = initLyricObject({
        start: start.current,
        end: song.duration,
        text,
      });

      setLyrics((prev) => [...prev, lyric]);
    }

    setIsChanged(true);
  };

  const removeLyric = () => {
    if (!lyrics.length) return;

    if (audioEle) {
      const prevStart = lyrics[lyrics.length - 1].start;

      start.current = prevStart;
      audioEle.currentTime = prevStart;

      setLyrics((prev) => prev.slice(0, -1));
      setIsChanged(true);
    }
  };

  const submit = async () => {
    try {
      setIsFetching(true);
      if (!song) return;

      const batch = writeBatch(db);

      const newSongLyric: SongLyricSchema = {
        // duration: song.duration,
        // name: song.name + "-" + song.singers.map((s) => s.name).join(", "),
        // is_official: song.is_official,
        lyrics: JSON.stringify(lyrics),
        base: baseLyric,
      };

      const songRef = doc(db, "Songs", song.id);

      // case add lyric
      if (!song.lyric_id) {
        const lyricRef = doc(collection(db, "Lyrics"));
        const newSongData: Partial<SongSchema> = {
          lyric_id: lyricRef.id,
          updated_at: serverTimestamp(),
        };

        batch.set(lyricRef, newSongLyric);
        batch.update(songRef, newSongData);

        // case update existed lyric
      } else {
        const lyricRef = doc(db, "Lyrics", song.lyric_id);
        batch.update(lyricRef, newSongLyric);
      }

      await batch.commit();

      setSuccessToast("Edit lyric successful");
      setIsChanged(false);
    } catch (error: any) {
      console.log({ error });
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
