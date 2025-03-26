import { NotFound, PlaylistList, SingerItem, Tab } from "@/components";
import { PlaylistSkeleton, SongItemSkeleton } from "@/components/skeleton";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetSearchResult from "./_hooks/useGetSearchResult";
import SongList from "@/modules/song-item/_components/SongList";
import useGetRecommend from "@/hooks/useGetRecomemded";
import BackBtn from "@/components/BackBtn";

export default function SearchResultPage() {
  const { isFetching, result, tab, setTab, tabs } = useGetSearchResult();

  const { handleSetSong } = useSetSong({ variant: "search-bar" });
  const { getRecommend } = useGetRecommend();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
    getRecommend(song);
  };

  const renderSkeleton = () => {
    switch (tab) {
      case "Song":
        return SongItemSkeleton;
      case "Playlist":
        return <div className="flex">{PlaylistSkeleton}</div>;
    }
  };

  const renderResult = () => {
    switch (tab) {
      case "Song":
        if (result.songs.length)
          return <SongList setSong={_handleSetSong} songs={result.songs} />;
        else return <NotFound className="mx-auto" />;

      case "Playlist":
        if (result.playlists.length)
          return <PlaylistList loading={false} playlists={result.playlists} />;
        else return <NotFound className="mx-auto" />;

      case "Singers":
        if (result.singers.length)
          return (
            <div className={`flex flex-row flex-wrap -mx-2 mt-3`}>
              {result.singers.map((s, i) => (
                <SingerItem variant="singer-item" singer={s} key={i} />
              ))}
            </div>
          );
        else return <NotFound className="mx-auto" />;
    }
  };

  return (
    <>
      <div className="mb-5">
        <BackBtn />
      </div>

      <div className="flex items-center mt-3">
        <div className="text-2xl font-bold">Result</div>

        <div className={`ml-5 ${isFetching ? "disable" : ""}`}>
          <Tab tabs={tabs} render={(t) => t} tab={tab} setTab={setTab} />
        </div>
      </div>

      <SongSelectProvider>
        <div className="mt-5">
          {isFetching && renderSkeleton()}
          {!isFetching && renderResult()}
        </div>
      </SongSelectProvider>
    </>
  );
}
