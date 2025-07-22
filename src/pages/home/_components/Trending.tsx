import { Button, Title } from "@/components";
import useGetTrendingSongs from "../_hooks/useGetTrending";
import { SongItemSkeleton } from "@/components/skeleton";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import { useThemeContext } from "@/stores";

export default function Trending() {
  const { theme } = useThemeContext();

  const { isFetching, songs } = useGetTrendingSongs();

  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, songs);
  };

  return (
    <div className={`${theme.bottom_player_bg} rounded-xl p-5`}>
      <Title title="Trending" />

      <SongSelectProvider>
        {isFetching && SongItemSkeleton}
        {!isFetching && (
          <SongList
            showIndex
            isHasCheckBox={false}
            songs={songs}
            setSong={(s) => _handleSetSong(s)}
          />
        )}
      </SongSelectProvider>

      <div className="text-center mt-5 border-none">
        <Button color={'primary'}>See more</Button>
      </div>
    </div>
  );
}
