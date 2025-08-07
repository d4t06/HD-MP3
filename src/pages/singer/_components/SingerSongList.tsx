import { Title } from "@/components";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useSingerContext } from "./SingerContext";
import { songItemSkeleton } from "@/components/skeleton";
import { getHidden } from "@/utils/appHelpers";

export default function SingerSongList() {
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { isFetching, songs } = useSingerContext();

  return (
    <>
      <div>
        <Title variant={"h2"} className={`mb-3 ${getHidden(!songs.length)}`} title="Popular Songs" />
        <SongSelectProvider>
          {isFetching ? (
            songItemSkeleton
          ) : (
            <SongList
              whenEmpty={<></>}
              songs={songs}
              setSong={(s) => handleSetSong(s.queue_id, [s])}
            />
          )}
        </SongSelectProvider>
      </div>
    </>
  );
}
