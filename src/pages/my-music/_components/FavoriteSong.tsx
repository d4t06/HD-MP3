import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { NotFound, Skeleton } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import SongList from "@/modules/song-item/_components/SongList";

export default function FavoriteSongList() {
  // hooks
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { favoriteSongs, user, isFetching } = useGetMyMusicSong({ tab: "favorite" });

  const _handleSetSong = (s: Song) => {
    handleSetSong(s.queue_id, favoriteSongs);
  };

  if (!user) return;

  return (
    <SongSelectProvider>
      <CheckedBar variant="favorite-song">
        {isFetching ? (
          <Skeleton className="h-[20px] w-[90px]" />
        ) : (
          <p className="font-[500] opacity-[.5]">{favoriteSongs.length} Songs</p>
        )}
      </CheckedBar>

      {/* song list */}
      {isFetching && SongItemSkeleton}

      {!isFetching && (
        <>
          {favoriteSongs.length ? (
            <>
              <SongList setSong={_handleSetSong} songs={favoriteSongs} />
            </>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </SongSelectProvider>
  );
}
