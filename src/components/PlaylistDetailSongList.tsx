import { useSelector } from "react-redux";
import { SongList } from "../components";
import CheckedBar from "./CheckedBar";
import SongSelectProvider from "@/stores/SongSelectContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import Skeleton, { SongItemSkeleton } from "./skeleton";
import useSetSong from "@/hooks/useSetSong";

type Props = {
  variant: "sys-playlist" | "my-playlist";
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

export default function PlaylistDetailSongList({ variant, loading }: Props) {
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
