import { Title } from "@/components";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSingerContext } from "./SingerContext";
import { SongItemSkeleton } from "@/components/skeleton";

export default function SingerSongList() {
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { isFetching, songs } = useSingerContext();

  return (
    <>
      <div>
        <Title variant={"h2"} title="Popular Songs" />
        <SongSelectProvider>
          {isFetching ? (
            SongItemSkeleton
          ) : (
            <SongList
              songs={songs}
              setSong={(s) => handleSetSong(s.queue_id, [s])}
            />
          )}
        </SongSelectProvider>
      </div>
    </>
  );
}
