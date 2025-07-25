import { NotFound, Tab, Title } from "@/components";
import { useThemeContext } from "@/stores";
import SongSelectProvider from "@/stores/SongSelectContext";
import useSongTable from "../useSongTable";
import { SongItemSkeleton } from "@/components/skeleton";
import SongList from "@/modules/song-item/_components/SongList";
import WeekSelect from "@/modules/week-select";

export default function SongTable() {
  const { theme } = useThemeContext();

  const { isFetching, songMap, setWeek, KEY, ...rest } = useSongTable();

  return (
    <div className={`${theme.bottom_player_bg} rounded-xl p-5`}>
      <Title title="Week Table" className="mb-3" />

      <div className="mb-5 space-y-3">
        <Tab className="w-fit" render={(t) => t} {...rest} />
        <WeekSelect submit={(value) => setWeek(value)} />
      </div>

      <SongSelectProvider>
        {isFetching && SongItemSkeleton}
        {!isFetching && (
          <>
            {songMap && songMap[KEY]?.songs.length ? (
              <SongList songs={songMap[KEY].songs} setSong={() => {}} />
            ) : (
              <NotFound />
            )}
          </>
        )}
      </SongSelectProvider>
    </div>
  );
}
