import { useDispatch } from "react-redux";

import { useToastContext } from "@/stores";
import {
  addSongToQueue,
  removeSongFromQueue,
} from "@/stores/redux/songQueueSlice";
import { nanoid } from "nanoid";

export default function useSongQueueAction() {
  const dispatch = useDispatch();

  const { setSuccessToast } = useToastContext();

  type RemoveFromQueue = {
    variant: "remove";
    index: number;
  };

  type AddToQueue = {
    variant: "add";
    songs: Song[];
  };

  const action = (props: AddToQueue | RemoveFromQueue) => {
    switch (props.variant) {
      case "add":
        const queueSongs = props.songs.map((s) => ({
          ...s,
          queue_id: nanoid(4),
        }));

        dispatch(addSongToQueue({ songs: queueSongs }));
        setSuccessToast("Song added to queue");
        break;
      case "remove":
        dispatch(
          removeSongFromQueue({
            index: props.index,
          }),
        );
    }
  };

  return { action };
}
