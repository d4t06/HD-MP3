import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type ViewMode = "edit" | "preview" | "import";

const useEditLyric = () => {
  const [song, setSong] = useState<Song>();
  const [baseLyric, setBaseLyric] = useState<string>("");
  const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [selectLyricIndex, setSelectLyricIndex] = useState<number>();

  // const [isImportLyric, setIsImportLyric] = useState(false);

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
    viewMode,
    setViewMode,
    // isPreview,
    // setIsPreview,
    // isImportLyric,
    // setIsImportLyric,
  };
};

type ContextType = ReturnType<typeof useEditLyric>;

const Context = createContext<ContextType | null>(null);

export default function EditLyricProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <Context.Provider value={useEditLyric()}>{children}</Context.Provider>;
}

export const useEditLyricContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Edit lyric context not found");
  return context;
};
