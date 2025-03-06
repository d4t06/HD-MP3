import { useSelector } from "react-redux";
import SongSelectProvider from "@/stores/SongSelectContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import useSetSong from "@/hooks/useSetSong";
import { CheckedBar, Skeleton, SongItem } from "@/components";
import { SongItemSkeleton } from "@/components/skeleton";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";

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
  const { currentSongData } = useSelector(selectSongQueue);

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

        {playlistSongs.map((song, index) => (
          <SongItem
            active={song.id === currentSongData?.song.id}
            onClick={() => _handleSetSong(song.queue_id)}
            variant="sys-song"
            isHasCheckBox
            song={song}
            index={index}
            key={song.queue_id}
          />
        ))}
      </SongSelectProvider>
    </>
  );
}
