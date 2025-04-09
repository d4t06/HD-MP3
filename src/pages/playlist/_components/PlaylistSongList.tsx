import { useSelector } from "react-redux";
import SongSelectProvider from "@/stores/SongSelectContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import useSetSong from "@/hooks/useSetSong";
import { Skeleton } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import CheckedBar from "@/modules/check-bar";
import SongList from "@/modules/song-item/_components/SongList";
import useUpdateRecentPlaylist from "@/hooks/useUpdateRecentPlaylis";

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
  const { playlistSongs, currentPlaylist } = useSelector(selectCurrentPlaylist);
  const { handleSetSong } = useSetSong({ variant: "playlist" });

  const { updatePlaylist } = useUpdateRecentPlaylist();

  const isAlbumAndHasImage = currentPlaylist?.is_album && !!currentPlaylist?.image_url;

  const _handleSetSong = (s: Song) => {
    if (!currentPlaylist) return;

    const isSetQueue = handleSetSong(s.queue_id, playlistSongs);
    if (isSetQueue) updatePlaylist(currentPlaylist);
  };

  if (loading) return playlistSongSkeleton;

  return (
    <>
      <SongSelectProvider>
        {!!playlistSongs.length && (
          <CheckedBar
            variant={variant === "others-playlist" ? "system-song" : "own-playlist"}
          >
            <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
          </CheckedBar>
        )}

        <SongList
          imageUrl={isAlbumAndHasImage ? currentPlaylist.image_url : ""}
          songs={playlistSongs}
          setSong={(s) => _handleSetSong(s)}
          songVariant={variant === "my-playlist" ? "own-playlist" : "system-song"}
        />
      </SongSelectProvider>
    </>
  );
}
