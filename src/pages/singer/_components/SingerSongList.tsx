import { Title } from "@/components";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import { useSingerContext } from "./SingerContext";
import { getHidden } from "@/utils/appHelpers";
import { SongSkeleton } from "@/components/skeleton";

export default function SingerSongList() {
  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { isFetching, songs } = useSingerContext();

  return (
    <>
      <div>
        <Title
          variant={"h2"}
          className={`mb-3 ${getHidden(!songs.length)}`}
          title="Popular Songs"
        />
        {isFetching ? (
          <SongSkeleton />
        ) : (
          <SongList
            isHasCheckBox={false}
            whenEmpty={<></>}
            songs={songs}
            setSong={(s) => handleSetSong(s.queue_id, songs)}
          />
        )}
      </div>
    </>
  );
}
