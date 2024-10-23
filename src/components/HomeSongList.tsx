import CheckedBar from "./CheckedBar";
import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue, setQueue } from "@/store/songQueueSlice";
import { useSongsStore } from "@/store";
import SongSelectProvider from "@/store/SongSelectContext";

type Props = {
  loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
  const dispatch = useDispatch();
  const { adminSongs } = useSongsStore();
  const { from } = useSelector(selectSongQueue);
  const { currentSong } = useSelector(selectCurrentSong);

  const handleSetSong = (song: Song, index: number) => {
    // song in playlist and song in user are two difference case
    if (currentSong?.id !== song.id || currentSong.song_in !== "admin") {
      dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));

      const isQueueHaveOtherSongs = from.length > 1 || from[0] != song.song_in;
      if (isQueueHaveOtherSongs) {
        dispatch(setQueue({ songs: adminSongs }));
      }
    }
  };

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
                handleSetSong={handleSetSong}
                activeExtend={
                  currentSong?.song_in === "admin" || currentSong?.song_in === "favorite"
                }
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
