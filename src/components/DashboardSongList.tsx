import { useSongsStore, useUpload } from "@/store";
import { useMemo } from "react";
import CheckedBar from "./CheckedBar";
import { Skeleton, SongList } from ".";
import { SongItemSkeleton } from "./skeleton";
import SongSelectProvider from "@/store/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";

type Props = {
  initialLoading: boolean;
};

export default function DashboardSongList({ initialLoading }: Props) {
  const { userSongs } = useSongsStore();

  // hooks
  const { tempSongs } = useUpload();
  const { handleSetSong } = useSetSong({ variant: "songs" });

  const songCount = useMemo(() => {
    return tempSongs.length + userSongs.length;
  }, [tempSongs, userSongs]);

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
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
                  songs={userSongs}
                  handleSetSong={_handleSetSong}
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
