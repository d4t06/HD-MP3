import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useUploadContext } from "@/stores";
import { NotFound, Skeleton } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import UploadingSongItem from "./UploadingSongItem";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import SongList from "@/modules/song-item/_components/SongList";

export default function FavoriteSongList() {
  //   stores

  // hooks
  const { uploadingSongs } = useUploadContext();
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { favoriteSongs, user, isFetching } = useGetMyMusicSong({ tab: "favorite" });

  const _handleSetSong = (s: Song) => {
    handleSetSong(s.queue_id, favoriteSongs);
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
                <SongList setSong={_handleSetSong} songs={favoriteSongs} />

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
