import { useSelector } from "react-redux";
import SongSelectProvider from "@/stores/SongSelectContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import useSetSong from "@/hooks/useSetSong";
import { CheckedBar, Skeleton, SongList } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";

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

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, playlistSongs);
  };

  if (loading) return playlistSongSkeleton;

  return (
    <>
      <SongSelectProvider>
        <CheckedBar variant={variant}>
          <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
        </CheckedBar>

        <SongList
          variant={variant}
          songs={playlistSongs}
          handleSetSong={_handleSetSong}
        />
      </SongSelectProvider>
    </>
  );
}
