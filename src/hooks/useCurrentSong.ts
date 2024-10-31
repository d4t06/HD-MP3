import { selectSongQueue } from "@/store/songQueueSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function useCurrentSong() {
  const { currentQueueId, queueSongs } = useSelector(selectSongQueue);

  const songData = useMemo(() => {
    for (let index = 0; index < queueSongs.length; index++) {
      const song = queueSongs[index];
      if (song.queue_id === currentQueueId) return { song, index };
    }
  }, [queueSongs, currentQueueId]);

  return {songData, queueSongs, currentQueueId};
}
