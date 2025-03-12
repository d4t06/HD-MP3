import { useMemo } from "react";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useUploadContext } from "@/stores";
import { NotFound, Skeleton, SongItem } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import UploadingSongItem from "./UploadingSongItem";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function FavoriteSongList() {
  //   stores
  const { currentSongData } = useSelector(selectSongQueue);

  // hooks
  const { uploadingSongs } = useUploadContext();
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { favoriteSongs, user, isFetching } = useGetMyMusicSong({ tab: "favorite" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, favoriteSongs);
  };

  if (!user) return;

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
          <p className="font-[500] opacity-[.5]">{favoriteSongs.length} Songs</p>
        )}
      </CheckedBar>

      {/* song list */}
      <div className="">
        {isFetching && SongItemSkeleton}

        {!isFetching && (
          <>
            {favoriteSongs.length ? (
              <>
                {favoriteSongs.map((song, index) => {
                  const isOwnSong =
                    song.owner_email === user.email && song.is_official === false;

                  return (
                    <SongItem
                      active={song.id === currentSongData?.song.id}
                      onClick={() => _handleSetSong(song.queue_id)}
                      variant={isOwnSong ? "own-song" : "system-song"}
                      isHasCheckBox
                      song={song}
                      index={index}
                      key={song.queue_id}
                    />
                  );
                })}

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
