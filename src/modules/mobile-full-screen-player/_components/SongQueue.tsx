import { useDispatch, useSelector } from "react-redux";
import { selectSongQueue, setCurrentQueueId } from "@/stores/redux/songQueueSlice";
import SongQueueItem from "./SongQueueItem";
import { Skeleton } from "@/components";

type Props = {
  currentIndex: number;
};

export default function MobileSongQueue({}: Props) {
  const dispatch = useDispatch();
  const { queueSongs, isFetching, currentQueueId } = useSelector(selectSongQueue);

  const skeleton = [...Array(5).keys()].map((i) => (
    <Skeleton key={i} className="h-[40px] mt-1" />
  ));

  const renderSongItems = () => (
    <>
      {queueSongs.map((song, index) => {
        return (
          <SongQueueItem
            key={index}
            song={song}
            active={currentQueueId === song.queue_id}
            onClick={() => dispatch(setCurrentQueueId(song.queue_id))}
          />
        );
      })}
    </>
  );

  return (
    <>
      {renderSongItems()}
      {isFetching && skeleton}
    </>
  );
}
