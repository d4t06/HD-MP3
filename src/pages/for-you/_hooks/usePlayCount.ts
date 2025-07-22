import { useEffect, useRef } from "react";
import { useSongsContext } from "../_stores/SongsContext";
import { increaseSongPlay } from "@/services/firebaseService";

export default function usePlayCount() {
  const { currentSong } = useSongsContext();

  const timerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentSong) return;

    timerId.current = setTimeout(() => increaseSongPlay(currentSong.id), 5000);

    return () => {
      clearTimeout(timerId.current);
    };
  }, [currentSong]);
}
