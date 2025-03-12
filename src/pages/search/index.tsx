import { PlaylistList, Tabs } from "@/components";
import { PlaylistSkeleton, SongItemSkeleton } from "@/components/skeleton";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetSearchResult from "./_hooks/useGetSearchResult";
import SongList from "@/modules/song-item/_components/SongList";

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
          return <SongList setSong={_handleSetSong} songs={result.songs} />;
        else return <p>...</p>;

      case "Playlist":
        if (result.playlists.length)
          return <PlaylistList loading={false} playlists={result.playlists} />;
        else return <p>...</p>;
    }
  };

  return (
    <>
      <div className="flex items-center mt-3">
        <div className="text-2xl font-bold">Result</div>

        <Tabs
          className={`ml-5 ${isFetching ? "disable" : ""}`}
          tabs={["Song", "Playlist"] as Array<typeof tab>}
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
