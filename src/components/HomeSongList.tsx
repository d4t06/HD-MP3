import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
import SongSelectProvider from "@/stores/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";
import { useSongContext } from "@/stores";
import Title from "./ui/Title";

type Props = {
  loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
  const { sysSongPlaylist } = useSongContext();
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
              <>
                <SongList
                  variant="home"
                  handleSetSong={_handleSetSong}
                  songs={sysSongPlaylist.songs}
                />
              </>
            ) : (
              <h1 className="text-[22px] text-center">...</h1>
            )}
          </>
        )}
      </SongSelectProvider>
    </>
  );
}
