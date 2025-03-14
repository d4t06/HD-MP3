import { createContext, ReactNode, useContext, useState } from "react";
import useGetSinger from "../_hooks/useGetSinger";

function getSinger() {
  const [isFetching, setIsFetching] = useState(true);
  return { isFetching, setIsFetching };
}

type ContextType = ReturnType<typeof getSinger>;

const Context = createContext<ContextType | null>(null);

function GetSinger({ children }: { children: ReactNode }) {
  useGetSinger();

  return children;
}

export default function GetSingerProvider({ children }: { children: ReactNode }) {
  return (
    <Context.Provider value={getSinger()}>
      <GetSinger>{children}</GetSinger>
    </Context.Provider>
  );
}

export function useGetSingerContext() {
  const ct = useContext(Context);

  if (!ct) throw new Error();
  return ct;
}
