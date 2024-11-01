import CheckedBar from "./CheckedBar";
import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
// import { useDispatch, useSelector } from "react-redux";
// import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
// import { selectSongQueue, setCurrentQueueId, setQueue } from "@/store/songQueueSlice";
import { useSongsStore } from "@/store";
import SongSelectProvider from "@/store/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";

type Props = {
  loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
  // const dispatch = useDispatch();
  const { adminSongs } = useSongsStore();

  const { handleSetSong } = useSetSong({ variant: "songs" });

  // const { currentQueueId, queueSongs } = useSelector(selectSongQueue);
  // const { currentSong } = useSelector(selectCurrentSong);

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, adminSongs);
  };

  // const handleSetSong = (queueId: string) => {
  //   // song in playlist and song in user are two difference case
  //   if (currentQueueId !== queueId) {
  //     dispatch(setCurrentQueueId(queueId));

  //     const currentQueueIdList = queueSongs.map((s) => s.id);
  //     const isDiff = adminSongs.find((s) => !currentQueueIdList.includes(s.queue_id));
  //     if (isDiff) {
  //       console.log("set queue");

  //       dispatch(setQueue({ songs: adminSongs }));
  //     }
  //   }
  // };

  return (
    <SongSelectProvider>
      <CheckedBar variant="home" />

      {/* admin song */}
      {loading && SongItemSkeleton}

      {!loading && (
        <>
          {!!adminSongs.length ? (
            <>
              <SongList
                variant="home"
                handleSetSong={_handleSetSong}
                songs={adminSongs}
              />
            </>
          ) : (
            <h1 className="text-[22px] text-center">...</h1>
          )}
        </>
      )}
    </SongSelectProvider>
  );
}
