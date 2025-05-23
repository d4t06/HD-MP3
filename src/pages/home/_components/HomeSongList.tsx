import { Tab, Title } from "@/components";
import useGetHomeSong from "../_hooks/useGetHomeSong";
import SongList from "@/modules/song-item/_components/SongList";
import { useSetSong } from "@/hooks";
import SongSelectProvider from "@/stores/SongSelectContext";
import CheckedBar from "@/modules/check-bar";
import useGetRecommend from "@/hooks/useGetRecomemded";
import { SongItemSkeleton } from "@/components/skeleton";

export default function HomeSongList() {
  const { isFetching, songMap, ...rest } = useGetHomeSong();

  const { handleSetSong } = useSetSong({ variant: "songs" });
  const { getRecommend } = useGetRecommend();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
    getRecommend(song);
  };

  return (
    <>
      <div>
        <Title title="Song" />

        <div className="flex space-x-1 my-2 p-1">
          <Tab render={(t) => t} {...rest} />
        </div>
        <SongSelectProvider>
          <CheckedBar variant="system-song">
            <p className="font-[500] opacity-[.5]">Songs</p>
          </CheckedBar>

          {isFetching && SongItemSkeleton}
          {!isFetching && (
            <SongList
              songs={songMap[rest.tab].songs}
              setSong={(s) => _handleSetSong(s)}
            />
          )}
        </SongSelectProvider>
      </div>
    </>
  );
}
