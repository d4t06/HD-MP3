import { NotFound, Tab, Title } from "@/components";
import useSongTable from "../useSongTable";
import SongList from "@/modules/song-item/_components/SongList";
import WeekSelect from "@/modules/week-select";
import { SongSkeleton } from "@/components/skeleton";
import { useSetSong } from "@/hooks";

export default function SongTable() {
  const { isFetching, songMapByGenre, setWeek, KEY, ...rest } = useSongTable();

  const { handleSetSong } = useSetSong({ variant: "songs" });

  return (
    <div>
      <Title title="Week Table" className="mb-3" />
      <div className="mb-5 space-y-3">
        <Tab className="w-fit" render={(t) => t} {...rest} />
        <WeekSelect submit={(value) => setWeek(value)} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 mt-3">
        {isFetching && (
          <SongSkeleton className="ml-[82px]" hasCheckBox={false} />
        )}
        {!isFetching && (
          <>
            {songMapByGenre && songMapByGenre[KEY]?.songs.length ? (
              <SongList
                songVariant="table"
                isHasCheckBox={false}
                songs={songMapByGenre[KEY].songs}
                setSong={(s) =>
                  handleSetSong(s.queue_id, songMapByGenre[KEY].songs)
                }
              />
            ) : (
              <NotFound />
            )}
          </>
        )}
      </div>
    </div>
  );
}
