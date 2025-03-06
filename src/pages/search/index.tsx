import { PlaylistList, SongItem, SongList, Tabs } from "@/components";
import { PlaylistSkeleton, SongItemSkeleton } from "@/components/skeleton";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetSearchResult from "./_hooks/useGetSearchResult";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";

export default function SearchResultPage() {
  const { isFetching, result, tab, setTab } = useGetSearchResult();
  const { currentSongData } = useSelector(selectSongQueue);

  const { handleSetSong } = useSetSong({ variant: "search-bar" });

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
  };

  // const handleSetTab = (t: typeof tab) => {
  //   setIsFetching(true)
  //   setTab(t)
  // }

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
          return result.songs.map((song, index) => (
            <SongItem
              active={song.id === currentSongData?.song.id}
              onClick={() => _handleSetSong(song)}
              variant="user-song"
              isHasCheckBox
              song={song}
              index={index}
              key={song.queue_id}
            />
          ));
        else return <p>...</p>;

      case "Playlist":
        if (result.playlists.length)
          return (
            <PlaylistList variant="others" loading={false} playlists={result.playlists} />
          );
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
