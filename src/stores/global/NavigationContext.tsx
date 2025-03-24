import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const useNavigation = () => {
  const [ahead, setAhead] = useState<string[]>([]);
  const [behind, setBehind] = useState<string[]>([]);
  const shouldStoreLocation = useRef(true);

  return {
    ahead,
    behind,
    setAhead,
    setBehind,
    shouldStoreLocation,
  };
};

type ContextType = ReturnType<typeof useNavigation>;

const Context = createContext<ContextType | null>(null);

export const useNavigationContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("Navigation context not provided");

  return ct;
};

export function PushBrowserHistory() {
  const { ahead, setAhead, setBehind, shouldStoreLocation } = useNavigationContext();

  const location = useLocation();
  const currentLocation = useMemo(() => location.pathname + location.search, [location]);

  const ranEffect = useRef(false);

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;
      return;
    }

    return () => {
      if (shouldStoreLocation.current) {
        if (ahead.length) setAhead([]);
        setBehind((prev) => [...prev, currentLocation]);
      } else shouldStoreLocation.current = true;
    };
  }, [location.pathname]);

  return <></>;
}

export default function NavigationProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useNavigation()}>{children}</Context.Provider>;
}
