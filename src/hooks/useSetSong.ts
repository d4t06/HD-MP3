import { setPlayStatus } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue, setCurrentQueueId, setQueue } from "@/stores/redux/songQueueSlice";
// import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  variant: "songs" | "playlist" | "search-bar";
};

export default function useSetSong({ variant }: Props) {
  const dispatch = useDispatch();
  const { currentQueueId, queueSongs, currentSongData } = useSelector(selectSongQueue);

  const KEY: keyof Song = useMemo(() => {
    switch (variant) {
      case "songs":
      case "search-bar":
        return "queue_id";
      case "playlist":
        return "queue_id";
    }
  }, []);

  const handleSetSong = (queueId: string, songs: Song[]) => {
    // song in playlist and song in user are two difference case
    if (currentQueueId !== queueId) {
      dispatch(setCurrentQueueId(queueId));
      dispatch(setPlayStatus({ playStatus: "loading" }));

      const currentSongIdList = queueSongs.map((s) => s[KEY]);
      let isDiff =
        !queueSongs.length ||
        queueSongs.length !== songs.length ||
        !!songs.find((s) => !currentSongIdList.includes(s[KEY]));

      // if (variant === "playlist") {
      //   const hasSetPlaylistQueue = getLocalStorage()["set_playlist_queue"];
      //   if (!hasSetPlaylistQueue) {
      //     isDiff = true;
      //     setLocalStorage("set_playlist_queue", true);
      //   }
      // }

      if (isDiff) {
        console.log("set queue");
        dispatch(setQueue({ songs }));
      }
    }
  };

  return { handleSetSong, currentSongData, queueSongs, currentQueueId };
}
