import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { NotFound, Skeleton } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import CheckedBar from "@/modules/check-bar";
import useGetMyMusicSong from "../_hooks/useGetMyMusicSong";
import SongList from "@/modules/song-item/_components/SongList";
import { useAuthContext, useSongContext } from "@/stores";
import { useEffect } from "react";

export default function FavoriteSongList() {
  const { favoriteSongs } = useSongContext();
  const { user } = useAuthContext();

  // hooks
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { getSongs, isFetching } = useGetMyMusicSong({ tab: "favorite" });

  const _handleSetSong = (s: Song) => {
    handleSetSong(s.queue_id, favoriteSongs);
  };

  useEffect(() => {
    getSongs();
  }, []);

  if (!user) return;

  return (
    <SongSelectProvider>
      <CheckedBar variant="favorite-song">
        {isFetching ? (
          <Skeleton className="h-[20px] w-[90px]" />
        ) : (
          <p className="font-[500] opacity-[.5]">
            {favoriteSongs.length} Songs
          </p>
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
