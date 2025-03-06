import { useMemo } from "react";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useSongContext, useUploadContext } from "@/stores";
import { Skeleton, SongItem } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import UploadingSongItem from "./UploadingSongItem";
import CheckedBar from "@/modules/check-bar";

type Props = {
  isLoading: boolean;
};

export default function MyMusicSongList({ isLoading }: Props) {
  //   stores
  const { songs } = useSongContext();
  const { currentSongData } = useSelector(selectSongQueue);

  // hooks
  const { uploadingSongs } = useUploadContext();
  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, songs);
  };

  const songCount = useMemo(() => {
    if (isLoading) return 0;
    return uploadingSongs.length + songs.length;
  }, [uploadingSongs, songs, isLoading]);

  return (
    <SongSelectProvider>
      <CheckedBar variant="my-songs">
        {isLoading ? (
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
        {isLoading && SongItemSkeleton}

        {!isLoading && (
          <>
            {!!songCount && (
              <>
                {songs.map((song, index) => (
                  <SongItem
                    active={song.id === currentSongData?.song.id}
                    onClick={() => _handleSetSong(song.queue_id)}
                    variant="user-song"
                    isHasCheckBox
                    song={song}
                    index={index}
                    key={song.queue_id}
                  />
                ))}

                {uploadingSongs.map((song, index) => (
                  <UploadingSongItem key={index} song={song} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </SongSelectProvider>
  );
}
