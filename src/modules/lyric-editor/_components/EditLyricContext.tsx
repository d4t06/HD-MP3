import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const useEditLyric = (p: { song?: SongSchema }) => {
  const [song, setSong] = useState<SongSchema | undefined>(p.song);
  const [baseLyric, setBaseLyric] = useState<string>("");
  const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [selectLyricIndex, setSelectLyricIndex] = useState<number>();

  const start = useRef(0);

  const currentLyric = useMemo(
    () =>
      selectLyricIndex !== undefined ? lyrics[selectLyricIndex] : undefined,
    [selectLyricIndex, lyrics],
  );

  const updateLyric = (index: number, payload: Partial<Lyric>) => {
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
    currentLyric,
    isPreview,
    setIsPreview,
  };
};

type ContextType = ReturnType<typeof useEditLyric>;

const Context = createContext<ContextType | null>(null);

export default function EditLyricProvider({
  children,
  song,
}: {
  children: ReactNode;
  song?: SongSchema;
}) {
  return (
    <Context.Provider
      value={useEditLyric({
        song,
      })}
    >
      {children}
    </Context.Provider>
  );
}

export const useEditLyricContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Edit lyric context not found");
  return context;
};
