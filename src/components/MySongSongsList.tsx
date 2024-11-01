import { useMemo } from "react";
import { useSongsStore, useUpload } from "../store";
import { SongList } from ".";
import Skeleton, { SongItemSkeleton } from "./skeleton";
import CheckedBar from "./CheckedBar";
import useSetSong from "@/hooks/useSetSong";

type Props = {
  initialLoading: boolean;
};

export default function MySongSongsList({ initialLoading }: Props) {
  //   store
  const { userSongs } = useSongsStore();

  // hooks
  const { tempSongs } = useUpload();
  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, userSongs);
  };

  const songCount = useMemo(() => {
    if (initialLoading) return 0;
    return tempSongs.length + userSongs.length;
  }, [tempSongs, userSongs, initialLoading]);

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
                  handleSetSong={_handleSetSong}
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
