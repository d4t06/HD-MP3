import { createContext, ReactNode, useContext, useRef, useState } from "react";

const useEditLyric = () => {
  const [baseLyric, setBaseLyric] = useState<string>("");
  const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const start = useRef(0);

  const updateLyric = (index: number, text: string) => {
    setLyrics((prev) => {
      const target = { ...prev[index], text };
      prev[index] = target;

      return [...prev];
    });
  };

  return {
    baseLyric,
    setBaseLyric,
    baseLyricArr,
    setBaseLyricArr,
    lyrics,
    setLyrics,
    currentLyricIndex,
    setCurrentLyricIndex,
    updateLyric,
    isFetching,
    setIsFetching,
    isChanged,
    setIsChanged,
    start,
  };
};

type ContextType = ReturnType<typeof useEditLyric>;

const Context = createContext<ContextType | null>(null);

export default function EditLyricContextProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useEditLyric()}>{children}</Context.Provider>;
}

export const useEditLyricContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Context not found");
  return context;
};
