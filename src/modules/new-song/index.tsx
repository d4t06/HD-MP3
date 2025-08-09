import { Button, Tab, Title } from "@/components";
import { songItemSkeleton } from "@/components/skeleton";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import { Link } from "react-router-dom";
import useGetNewSongs from "./useGetNewSong";
import useGetRelativeSongs from "../song-queue/_hooks/useGetRelativeSongs";

type Props = {
  amount: number;
};

export default function NewSong(props: Props) {
  const { isFetching, currentSongs, ...rest } = useGetNewSongs(props);
  const { getRelatigeSongs } = useGetRelativeSongs();

  const { handleSetSong } = useSetSong({ variant: "songs" });

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
    getRelatigeSongs(song);
  };

  return (
    <>
      <div>
        <Title title="New song" className="mb-3" />

        <div className="mb-5 space-y-3">
          <Tab className="w-fit" render={(t) => t} {...rest} />
        </div>

        <SongSelectProvider>
          {isFetching && songItemSkeleton}
          {!isFetching && (
            <SongList
              isHasCheckBox={false}
              songs={currentSongs}
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
