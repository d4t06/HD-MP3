import { splitStringByCutPositions } from "@/utils/lyricEditorHelper";
import { createContext, ReactNode, useContext, useMemo, useRef, useState } from "react";

const useEditLyric = () => {
  const [song, setSong] = useState<Song>();
  const [baseLyric, setBaseLyric] = useState<string>("");
  const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState<RealTimeLyric[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectLyricIndex, setSelectLyricIndex] = useState<number>();

  const start = useRef(0);

  const currentLyric = useMemo(
    () => (selectLyricIndex !== undefined ? lyrics[selectLyricIndex] : undefined),
    [selectLyricIndex, lyrics],
  );

  const currentWords = useMemo(
    () => (currentLyric ? currentLyric.text.trim().split(" ") : []),
    [currentLyric?.text],
  );

  const currentLyricWordsData = useMemo(() => {
    if (!currentLyric) return [];

    return currentWords.map((w, i) => ({
      text: w,
      cutPositions: currentLyric.cutData[i],
    }));
  }, [currentLyric]);

  const currentSplitWords = useMemo(() => {
    const splitWords: string[] = [];

    currentLyricWordsData.forEach((data) => {
      const words = splitStringByCutPositions(data.text, data.cutPositions);
      splitWords.push(...words);
    });

    return splitWords.filter((w) => w);
  }, [currentLyric]);

  const updateLyric = (index: number, payload: Partial<RealTimeLyric>) => {
    setLyrics((prev) => {
      const target = { ...prev[index], ...payload };
      prev[index] = target;

      return [...prev];
    });
  };

  return {
    song,
    setSong,
    baseLyric,
    setBaseLyric,
    baseLyricArr,
    setBaseLyricArr,
    lyrics,
    setLyrics,
    updateLyric,
    isFetching,
    setIsFetching,
    isChanged,
    setIsChanged,
    start,
    selectLyricIndex,
    setSelectLyricIndex,
    currentLyricWordsData,
    currentLyric,
    currentSplitWords,
    currentWords,
  };
};

type ContextType = ReturnType<typeof useEditLyric>;

const Context = createContext<ContextType | null>(null);

export default function EditLyricProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useEditLyric()}>{children}</Context.Provider>;
}

export const useEditLyricContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Edit lyric context not found");
  return context;
};
