import { usePlayerContext } from "@/stores";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHideSongQueue() {
  const { setIsOpenSongQueue } = usePlayerContext();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setIsOpenSongQueue(false);
    }
  }, [location]);
}
