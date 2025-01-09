import CheckedBar from "./CheckedBar";
import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
import SongSelectProvider from "@/store/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";
import { useSongContext } from "@/store";

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
    <SongSelectProvider>
      <CheckedBar variant="home" />

      {loading && SongItemSkeleton}

      {!loading && (
        <>
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
  );
}
