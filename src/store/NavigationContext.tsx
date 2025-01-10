import { ReactNode, createContext, useContext, useState } from "react";

const useNavigation = () => {
  const [ahead, setAhead] = useState<string[]>([]);
  const [behind, setBehind] = useState<string[]>([]);

  return {
    ahead,
    behind,
    setAhead,
    setBehind,
  };
};

type ContextType = ReturnType<typeof useNavigation>;

const Context = createContext<ContextType | null>(null);

export default function NavigationProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useNavigation()}>{children}</Context.Provider>;
}

export const useNavigationContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("Navigation context not provided");

  return ct;
};
