import { Button, Title } from "@/components";
import { songItemSkeleton } from "@/components/skeleton";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetTrendingSongs from "@/modules/trending-song/useGetTrending";

export default function Trending() {
  const { isFetching, songs } = useGetTrendingSongs({ amount: 5 });

  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, songs);
  };

  return (
    <div className={`rounded-xl p-5`}>
      <Title title="Trending" />

      <SongSelectProvider>
        {isFetching && songItemSkeleton}
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
        <Button color={"primary"}>See more</Button>
      </div>
    </div>
  );
}
