import { useSelector } from "react-redux";
import SongSelectProvider from "@/stores/SongSelectContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import useSetSong from "@/hooks/useSetSong";
import { Skeleton } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import CheckedBar from "@/modules/check-bar";
import SongList from "@/modules/song-item/_components/SongList";

type Props = {
  variant: "others-playlist" | "my-playlist";
  loading: boolean;
};

const playlistSongSkeleton = (
  <>
    <div className="h-[30px] mb-[10px] flex items-center">
      <Skeleton className="h-[20px] w-[90px]" />
    </div>

    {SongItemSkeleton}
  </>
);

export default function PlaylistSongList({ variant, loading }: Props) {
  const { playlistSongs } = useSelector(selectCurrentPlaylist);
  const { handleSetSong } = useSetSong({ variant: "playlist" });

  const _handleSetSong = (s: Song) => {
    handleSetSong(s.queue_id, playlistSongs);
  };

  if (loading) return playlistSongSkeleton;

  return (
    <>
      <SongSelectProvider>
        {!!playlistSongs.length && (
          <CheckedBar variant={variant === "others-playlist" ? "system" : "own-playlist"}>
            <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
          </CheckedBar>
        )}

        <SongList
          songs={playlistSongs}
          setSong={(s) => _handleSetSong(s)}
          songVariant={variant === "my-playlist" ? "own-playlist" : "system-song"}
        />
      </SongSelectProvider>
    </>
  );
}
