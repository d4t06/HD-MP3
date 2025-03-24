import { useNavigationContext } from "@/stores";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useNavigationButton() {
  const { behind, ahead, shouldStoreLocation, setBehind, setAhead } =
    useNavigationContext();

  const location = useLocation();
  const navigator = useNavigate();

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

  const goHome = () => {
    navigator("/");
  };

  return { ahead, behind, backward, forward, goHome };
}
