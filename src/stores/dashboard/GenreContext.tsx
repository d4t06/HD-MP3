import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

function useGenre() {
  const [genres, setGenres] = useState<Genre[]>([]);

  const { mains, subs } = useMemo(() => {
    const mains: Genre[] = [];
    const subs: Genre[] = [];

    genres.forEach((g) => {
      if (g.is_main) mains.push(g);
      else subs.push(g);
    });

    return { mains, subs };
  }, [genres]);

  const shouldFetchGenre = useRef(true);

  return {
    genres,
    mains,
    subs,
    shouldFetchGenre,
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
