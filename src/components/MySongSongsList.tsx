import { useMemo } from "react";
import { useSongContext, useUpload } from "../store";
import { SongList } from ".";
import Skeleton, { SongItemSkeleton } from "./skeleton";
import CheckedBar from "./CheckedBar";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/store/SongSelectContext";

type Props = {
  initialLoading: boolean;
};

export default function MySongSongsList({ initialLoading }: Props) {
  //   store
  const { songs } = useSongContext();

  // hooks
  const { tempSongs } = useUpload();
  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, songs);
  };

  const songCount = useMemo(() => {
    if (initialLoading) return 0;
    return tempSongs.length + songs.length;
  }, [tempSongs, songs, initialLoading]);

  return (
    <SongSelectProvider>
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
                  songs={songs}
                  tempSongs={tempSongs}
                />
                <SongList songs={tempSongs} variant="uploading" />
              </>
            )}
          </>
        )}
      </div>
    </SongSelectProvider>
  );
}
