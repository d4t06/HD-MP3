import { useEffect, useRef } from "react";
import { useSongsContext } from "../_stores/SongsContext";
import { increaseSongPlay } from "@/services/firebaseService";
import usePushRecentSong from "@/layout/primary-layout/_hooks/usePushRecentSong";

export default function usePlayCount() {
  const { currentSong } = useSongsContext();

  const { pushRecentSong } = usePushRecentSong();

  const timerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentSong) return;

    timerId.current = setTimeout(() => {
      increaseSongPlay(currentSong.id);
      pushRecentSong(currentSong);
    }, 5000);

    return () => {
      clearTimeout(timerId.current);
    };
  }, [currentSong]);
}
