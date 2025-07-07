import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

function useSong() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(999);

  const firstTimeSongLoaded = useRef(true);

  const currentSong = useMemo(() => songs[currentIndex], [songs, currentIndex]);

  return {
    currentSong,
    songs,
    setSongs,
    currentIndex,
    setCurrentIndex,
    firstTimeSongLoaded,
  };
}

type ContextType = ReturnType<typeof useSong>;

const context = createContext<ContextType | null>(null);

export default function SongsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <context.Provider value={useSong()}>{children}</context.Provider>;
}

export function useSongsContext() {
  const ct = useContext(context);
  if (!ct) throw new Error("SongsContextProvider not provided");

  return ct;
}
