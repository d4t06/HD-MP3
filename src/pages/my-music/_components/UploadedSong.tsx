import { useEffect, useMemo, useRef } from "react";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useAuthContext, useSongContext, useUploadContext } from "@/stores";
import { Button, NotFound, Skeleton } from "@/components";
import { songItemSkeleton } from "@/components/skeleton";
import UploadingSongItem from "./UploadingSongItem";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import SongList from "@/modules/song-item/_components/SongList";

export default function UploadedSongList() {
  const { uploadedSongs } = useSongContext();
  const { user } = useAuthContext();
  const labelRef = useRef<HTMLLabelElement>(null);

  // hooks
  const { uploadingSongs, isUploading } = useUploadContext();
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { isFetching, getSongs } = useGetMyMusicSong({
    tab: "uploaded",
  });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, uploadedSongs);
  };

  const songCount = useMemo(() => {
    if (isFetching) return 0;
    return uploadingSongs.length + uploadedSongs.length;
  }, [uploadingSongs, uploadedSongs, isFetching]);

  useEffect(() => {
    getSongs();
  }, []);

  if (!user) return <></>;

  return (
    <SongSelectProvider>
      <label htmlFor="song_upload" className="hidden" ref={labelRef}></label>
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

            <Button
              onClick={() => labelRef.current?.click()}
              color="primary"
              disabled={isUploading}
            >
              <ArrowUpTrayIcon className="w-5" />
              <span className="">Upload</span>
            </Button>
          </div>
        )}
      </CheckedBar>

      {/* song list */}
      <div className="">
        {isFetching && songItemSkeleton}

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
              <NotFound variant="less" />
            )}
          </>
        )}
      </div>
    </SongSelectProvider>
  );
}
