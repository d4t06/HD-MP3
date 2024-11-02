import CheckedBar from "./CheckedBar";
import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
import { useSongsStore } from "@/store";
import SongSelectProvider from "@/store/SongSelectContext";
import useSetSong from "@/hooks/useSetSong";

type Props = {
  loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
  const { adminSongs } = useSongsStore();
  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (queueId: string) => {
    handleSetSong(queueId, adminSongs);
  };

  return (
    <SongSelectProvider>
      <CheckedBar variant="home" />

      {loading && SongItemSkeleton}

      {!loading && (
        <>
          {!!adminSongs.length ? (
            <>
              <SongList
                variant="home"
                handleSetSong={_handleSetSong}
                songs={adminSongs}
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
