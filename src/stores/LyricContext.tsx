import { createContext, ReactNode, useContext, useRef, useState } from "react";

const useLyric = () => {
  const [songLyrics, setSongLyrics] = useState<Lyric[]>([]);
  const [loading, setLoading] = useState(false);

  const shouldGetLyric = useRef(true);

  return { songLyrics, setSongLyrics, loading, setLoading, shouldGetLyric };
};

type ContextType = ReturnType<typeof useLyric>;

const Context = createContext<ContextType | null>(null);

export default function LyricContextProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useLyric()}>{children}</Context.Provider>;
}

export const useLyricContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("Lyric context not found");

  return ct;
};
