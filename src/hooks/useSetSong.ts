import { selectSongQueue, setCurrentQueueId, setQueue } from "@/store/songQueueSlice";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  variant: "songs" | "playlist";
};

export default function useSetSong({ variant }: Props) {
  const dispatch = useDispatch();
  const { currentQueueId, queueSongs, currentSongData } = useSelector(selectSongQueue);

  const KEY: keyof Song = useMemo(() => {
    switch (variant) {
      case "songs":
        return "queue_id";
      case "playlist":
        return "id";
    }
  }, []);

  const handleSetSong = (queueId: string, songs: Song[]) => {
    // song in playlist and song in user are two difference case
    if (currentQueueId !== queueId) {
      dispatch(setCurrentQueueId(queueId));

      const currentSongIdList = queueSongs.map((s) => s[KEY]);
      const isDiff =
        !queueSongs.length ||
        queueSongs.length !== songs.length ||
        !!songs.find((s) => !currentSongIdList.includes(s[KEY]));

      if (isDiff) {
        console.log("set quuee");
        dispatch(setQueue({ songs }));
      }
    }
  };

  return { handleSetSong, currentSongData, queueSongs, currentQueueId };
}
