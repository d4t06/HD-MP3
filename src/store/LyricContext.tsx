import { createContext, ReactNode, useContext, useRef, useState } from "react";

const useLyric = () => {
  const [songLyrics, setSongLyrics] = useState<RealTimeLyric[]>([]);
  const [loading, setLoading] = useState(false);

  const ranGetLyric = useRef(false);

  return { songLyrics, setSongLyrics, loading, setLoading, ranGetLyric };
};

type ContextType = ReturnType<typeof useLyric>;

const Context = createContext<ContextType | null>(null);

export default function LyricContextProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useLyric()}>{children}</Context.Provider>;
}

export const useLyricContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("");

  return ct;
};
