import { PlaylistList, SongList, Tabs } from "@/components";
import { PlaylistSkeleton, SongItemSkeleton } from "@/components/skeleton";
import useGetSearchResult from "@/hooks/useGetSearchResult";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/store/SongSelectContext";

export default function SearchResultPage() {
  const { isFetching, result, tab, setTab } = useGetSearchResult();

  const { handleSetSong } = useSetSong({ variant: "search-bar" });

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
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
          return (
            <SongList
              variant="search-bar"
              handleSetSong={_handleSetSong}
              songs={result.songs}
            />
          );
        else return <p>...</p>;

      case "Playlist":
        if (result.playlists.length)
          return <PlaylistList variant="search-page" playlists={result.playlists} />;
        else return <p>...</p>;
    }
  };

  return (
    <>
      <div className="flex items-center mt-3">
        <div className="text-2xl font-bold">Result</div>

        <Tabs
          className="ml-3"
          tabs={["Song", "Playlist"]}
          render={(t) => <p>{t}</p>}
          activeTab={tab}
          setActiveTab={setTab}
        />
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
