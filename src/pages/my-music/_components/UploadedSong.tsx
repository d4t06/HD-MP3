import { useEffect, useMemo } from "react";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useThemeContext, useUploadContext } from "@/stores";
import { NotFound, Skeleton, SongItem } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import UploadingSongItem from "./UploadingSongItem";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function UploadedSongList() {
  //   stores

  const { theme } = useThemeContext();
  const { currentSongData } = useSelector(selectSongQueue);

  // hooks
  const { uploadingSongs } = useUploadContext();
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { uploadedSongs, isFetching } = useGetMyMusicSong({ tab: "uploaded" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, uploadedSongs);
  };

  const songCount = useMemo(() => {
    if (isFetching) return 0;
    return uploadingSongs.length + uploadedSongs.length;
  }, [uploadingSongs, uploadedSongs, isFetching]);

  useEffect(() => {}, []);

  return (
    <SongSelectProvider>
      <CheckedBar variant="my-songs">
        {isFetching ? (
          <>
            <div className="h-[30px] mb-[10px] flex items-center">
              <Skeleton className="h-[20px] w-[90px]" />
            </div>
          </>
        ) : (
          <div className="flex justify-between w-full">
            <p className="font-[500] opacity-[.5]">{songCount} Songs</p>

            <label
              className={`${theme.content_bg} items-center space-x-1 hover:opacity-80 py-1 rounded-full flex px-4 cursor-pointer`}
              htmlFor="song_upload"
            >
              <ArrowUpTrayIcon className="w-5" />
              <span className="">Upload</span>
            </label>
          </div>
        )}
      </CheckedBar>

      {/* song list */}
      <div className="">
        {isFetching && SongItemSkeleton}

        {!isFetching && (
          <>
            {songCount ? (
              <>
                {uploadedSongs.map((song, index) => (
                  <SongItem
                    active={song.id === currentSongData?.song.id}
                    onClick={() => _handleSetSong(song.queue_id)}
                    variant="own-song"
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
            ) : (
              <NotFound />
            )}
          </>
        )}
      </div>
    </SongSelectProvider>
  );
}
