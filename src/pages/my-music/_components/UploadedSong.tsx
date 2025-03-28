import { useMemo } from "react";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useThemeContext, useUploadContext } from "@/stores";
import { NotFound, Skeleton } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import UploadingSongItem from "./UploadingSongItem";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import SongList from "@/modules/song-item/_components/SongList";

export default function UploadedSongList() {
  //   stores
  const { theme } = useThemeContext();

  // hooks
  const { uploadingSongs, isUploading } = useUploadContext();
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { uploadedSongs, isFetching, user } = useGetMyMusicSong({ tab: "uploaded" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, uploadedSongs);
  };

  const songCount = useMemo(() => {
    if (isFetching) return 0;
    return uploadingSongs.length + uploadedSongs.length;
  }, [uploadingSongs, uploadedSongs, isFetching]);

  if (!user) return <></>;

  return (
    <SongSelectProvider>
      <CheckedBar variant="uploaded-song">
        {isFetching ? (
          <>
            <div className="h-[30px] mb-[10px] flex items-center">
              <Skeleton className="h-[20px] w-[90px]" />
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center w-full">
            <p className="font-[500] opacity-[.5]">{songCount} Songs</p>

            <button disabled={isUploading}>
              <label
                className={`${theme.content_bg} items-center space-x-1 hover:opacity-80 py-1 rounded-full flex px-4 cursor-pointer`}
                htmlFor="song_upload"
              >
                <ArrowUpTrayIcon className="w-5" />
                <span className="">Upload</span>
              </label>
            </button>
          </div>
        )}
      </CheckedBar>

      {/* song list */}
      <div className="">
        {isFetching && SongItemSkeleton}

        {!isFetching && (
          <>
            {!!songCount ? (
              <>
                {!!uploadedSongs.length && (
                  <SongList
                    setSong={(s) => _handleSetSong(s.queue_id)}
                    songs={uploadedSongs}
                    songVariant="own-song"
                  />
                )}
                {uploadingSongs.map((song, index) => (
                  <UploadingSongItem key={index} song={song} />
                ))}
              </>
            ) : (
              <NotFound />
            )}
          </>
        )}
      </div>
    </SongSelectProvider>
  );
}
