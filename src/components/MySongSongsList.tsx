import { useMemo } from "react";
import { useSongsStore, useUpload } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { SongList } from ".";
import Skeleton, { SongItemSkeleton } from "./skeleton";
import CheckedBar from "./CheckedBar";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue, setQueue } from "@/store/songQueueSlice";

type Props = {
  initialLoading: boolean;
};

export default function MySongSongsList({ initialLoading }: Props) {
  const dispatch = useDispatch();

  //   store
  const { userSongs } = useSongsStore();
  const { currentSong } = useSelector(selectCurrentSong);
  const { from, queueSongs } = useSelector(selectSongQueue);

  // hooks
  const { tempSongs } = useUpload();

  const songCount = useMemo(() => {
    if (initialLoading) return 0;
    return tempSongs.length + userSongs.length;
  }, [tempSongs, userSongs, initialLoading]);

  const handleSetSong = (song: Song, index: number) => {
    const isSetQueue =
      from.length > 1 || userSongs.length !== queueSongs.length || from[0] != "user";
    if (isSetQueue) dispatch(setQueue({ songs: userSongs }));

    // song in playlist and song in user are two difference case
    if (currentSong?.id !== song.id || currentSong?.song_in !== "user") {
      dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));
    }
  };

  return (
    <>
      <CheckedBar variant="my-songs">
        {initialLoading ? (
          <>
            <div className="h-[30px] mb-[10px] flex items-center">
              <Skeleton className="h-[20px] w-[90px]" />
            </div>
          </>
        ) : (
          <p className="font-[500] opacity-[.5]">{songCount} Songs</p>
        )}
      </CheckedBar>

      {/* song list */}
      <div className="min-h-[50vh]">
        {initialLoading && SongItemSkeleton}

        {!initialLoading && (
          <>
            {!!songCount && (
              <>
                <SongList
                  variant="my-songs"
                  handleSetSong={handleSetSong}
                  activeExtend={
                    currentSong?.song_in === "user" || currentSong?.song_in === "favorite"
                  }
                  songs={userSongs}
                  tempSongs={tempSongs}
                />
                <SongList songs={tempSongs} variant="uploading" />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
