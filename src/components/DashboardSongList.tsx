import { useSongContext, useUpload } from "@/stores";
import { useMemo } from "react";
import CheckedBar from "./CheckedBar";
import { Skeleton, SongList } from ".";
import { SongItemSkeleton } from "./skeleton";
import SongSelectProvider from "@/stores/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";

type Props = {
  initialLoading: boolean;
};

export default function DashboardSongList({ initialLoading }: Props) {
  const { songs } = useSongContext();

  // hooks
  const { tempSongs } = useUpload();
  const { handleSetSong } = useSetSong({ variant: "songs" });

  const songCount = useMemo(() => {
    return tempSongs.length + songs.length;
  }, [tempSongs, songs]);

  const _handleSetSong = (queue_id: string) => {
    handleSetSong(queue_id, []);
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
                  variant="home"
                  songs={songs}
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
