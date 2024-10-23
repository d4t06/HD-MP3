import { useSongsStore, useUpload } from "@/store";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckedBar from "./CheckedBar";
import { Skeleton, SongList } from ".";
import { SongItemSkeleton } from "./skeleton";
import SongSelectProvider from "@/store/SongSelectContext";

type Props = {
  initialLoading: boolean;
};

export default function DashboardSongList({ initialLoading }: Props) {
  // store
  const dispatch = useDispatch();
  const { userSongs } = useSongsStore();
  const { currentSong } = useSelector(selectCurrentSong);

  // hooks
  const { tempSongs } = useUpload();

  const songCount = useMemo(() => {
    return tempSongs.length + userSongs.length;
  }, [tempSongs, userSongs]);

  const handleSetSong = (song: Song, index: number) => {
    if (currentSong?.id !== song.id) {
      dispatch(setSong({ ...song, currentIndex: index }));
    }
  };

  return (
    <SongSelectProvider>
      <CheckedBar variant="dashboard-songs">
        {initialLoading ? (
          <>
            <div className="h-[30px] mb-[10px] flex items-center">
              <Skeleton className="h-[20px] w-[90px]" />
            </div>
          </>
        ) : (
          <p className="font-semibold opacity-[.6]">{songCount} Songs</p>
        )}
      </CheckedBar>

      <div className="min-h-[50vh]">
        {initialLoading && SongItemSkeleton}

        {!initialLoading && (
          <>
            {!!songCount ? (
              <>
                <SongList
                  variant="dashboard-songs"
                  tempSongs={tempSongs}
                  activeExtend={true}
                  songs={userSongs}
                  handleSetSong={handleSetSong}
                />
                <SongList variant="uploading" songs={tempSongs} />
              </>
            ) : (
              <p className="text-center">¯\_(ツ)_/¯</p>
            )}
          </>
        )}
      </div>
    </SongSelectProvider>
  );
}
