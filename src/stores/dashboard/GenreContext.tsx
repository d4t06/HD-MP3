import { createContext, ReactNode, useContext, useRef, useState } from "react";

function useGenre() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  const shouldFetchGenre = useRef(true);

  return {
    genres,
    shouldFetchGenre,
    languages,
    setLanguages,
    setGenres,
  };
}

type ContextType = ReturnType<typeof useGenre>;

const Context = createContext<ContextType | null>(null);

export default function GenreProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useGenre()}>{children}</Context.Provider>;
}

export const useGenreContext = () => {
  const ct = useContext(Context);

  if (!ct) throw new Error("GenreProvider is not provided");

  return ct;
};
