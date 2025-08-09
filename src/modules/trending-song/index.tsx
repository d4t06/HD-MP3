import { Button, Title } from "@/components";
import useGetTrendingSongs from "./useGetTrending";
import { songItemSkeleton } from "@/components/skeleton";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import { Link } from "react-router-dom";
import useGetRelativeSongs from "../song-queue/_hooks/useGetRelativeSongs";

type Props = {
  amount: number;
};

export default function TrendingSong(props: Props) {
  const { isFetching, songs } = useGetTrendingSongs(props);

  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { getRelatigeSongs } = useGetRelativeSongs();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, songs);
    getRelatigeSongs(song);
  };

  return (
    <>
      <div>
        <Title title="Trending" className="mb-3" />
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
          <Link to={"/trending"}>
            <Button color={"primary"}>See more</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
