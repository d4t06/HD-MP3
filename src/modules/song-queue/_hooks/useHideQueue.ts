import { usePlayerContext } from "@/stores";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHideSongQueue() {
  const { setIsOpenSongQueue, isOpenSongQueue } = usePlayerContext();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setIsOpenSongQueue(false);
    }
  }, [location]);

  useEffect(() => {
    if (isOpenSongQueue) {
      const activeSongItem = document.querySelector(".queue-songlist .active");

      if (activeSongItem)
        activeSongItem.scrollIntoView({ behavior: "instant" });
    }
  }, [isOpenSongQueue]);
}
