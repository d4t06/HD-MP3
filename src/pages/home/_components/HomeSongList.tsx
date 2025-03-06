import SongSelectProvider from "@/stores/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";
import { useSongContext } from "@/stores";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { SongItemSkeleton } from "@/components/skeleton";
import { SongItem, Title } from "@/components";

type Props = {
  loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
  const { sysSongPlaylist } = useSongContext();
  const { currentSongData } = useSelector(selectSongQueue);

  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, sysSongPlaylist.songs);
  };

  return (
    <>
      <SongSelectProvider>
        {loading && SongItemSkeleton}

        {!loading && (
          <>
            <Title title="Songs" />

            {!!sysSongPlaylist.songs.length ? (
              sysSongPlaylist.songs.map((song, index) => (
                <SongItem
                  active={song.id === currentSongData?.song.id}
                  onClick={() => _handleSetSong(song.queue_id)}
                  variant="sys-song"
                  isHasCheckBox
                  song={song}
                  index={index}
                  key={song.queue_id}
                />
              ))
            ) : (
              <h1 className="text-[22px] text-center">...</h1>
            )}
          </>
        )}
      </SongSelectProvider>
    </>
  );
}
