import { useNavigationContext } from "@/store/NavigationContext";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useNavigationButton() {
  const { behind, ahead, setBehind, setAhead } = useNavigationContext();

  const location = useLocation();
  const navigator = useNavigate();

  const shouldStoreLocation = useRef(true);
  const firstTimeRunEffect = useRef(true);

  const currentLocation = useMemo(() => location.pathname + location.search, [location]);

  const backward = () => {
    const newBehind = [...behind];

    const lastBehind = newBehind.pop();

    if (lastBehind) {
      shouldStoreLocation.current = false;

      setAhead((prev) => [...prev, currentLocation]);

      setBehind(newBehind);

      navigator(lastBehind);
    }
  };

  const forward = () => {
    const newAhead = [...ahead];

    const lastAhead = newAhead.pop();

    if (lastAhead) {
      shouldStoreLocation.current = false;

      setBehind((prev) => [...prev, currentLocation]);

      setAhead(newAhead);

      navigator(lastAhead);
    }
  };

  useEffect(() => {
    if (firstTimeRunEffect.current) {
      firstTimeRunEffect.current = false;
      return;
    }

    return () => {
      if (shouldStoreLocation.current) {
        if (ahead.length) setAhead([]);
        setBehind((prev) => [...prev, currentLocation]);
      } else shouldStoreLocation.current = true;
    };
  }, [location.pathname]);

  return { ahead, behind, backward, forward };
}
