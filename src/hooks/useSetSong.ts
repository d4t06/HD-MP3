import { selectSongQueue, setCurrentQueueId, setQueue } from "@/store/songQueueSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useSetSong() {
  const dispatch = useDispatch();
  const { currentQueueId, queueSongs } = useSelector(selectSongQueue);

  const handleSetSong = (queueId: string, songs: Song[]) => {
    // song in playlist and song in user are two difference case
    if (currentQueueId !== queueId) {
      dispatch(setCurrentQueueId(queueId));

      const currentQueueIdList = queueSongs.map((s) => s.queue_id);
      const isDiff =
        !queueSongs.length || songs.find((s) => !currentQueueIdList.includes(s.queue_id));
      if (isDiff) {

        console.log('set quuee');
        

        dispatch(setQueue({ songs }));
      }
    }
  };

  return { handleSetSong, queueSongs, currentQueueId };
}
