import { NotFound, PlaylistList, Tab, Title } from "@/components";
import { songItemSkeleton } from "@/components/skeleton";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetSearchResult from "./_hooks/useGetSearchResult";
import SongList from "@/modules/song-item/_components/SongList";
import useGetRecommend from "@/hooks/useGetRecomemded";
import Search from "@/modules/search";
import { useThemeContext } from "@/stores";
import Footer from "@/layout/primary-layout/_components/Footer";
import SingerList from "@/components/ui/SingerList";

export default function SearchResultPage() {
  const { isOnMobile } = useThemeContext();
  const { isFetching, setIsFetching, result, tab, setTab, tabs } =
    useGetSearchResult();

  const { handleSetSong } = useSetSong({ variant: "search-bar" });
  const { getRecommend } = useGetRecommend();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
    getRecommend(song);
  };

  return (
    <>
      {isOnMobile && <Search />}

      <div className="md:flex items-center mt-3">
        <Title title="Result" className="mt-1 md:mt-0" />
        <Tab
          className="w-fit [&_button]:text-sm mt-3 md:[&_button]:text-base md:mt-0 md:ml-4"
          tabs={tabs}
          render={(t) => t}
          tab={tab}
          setTab={(t) => {
            setTab(t);
            setIsFetching(true);
          }}
        />
      </div>

      <SongSelectProvider>
        <div className="mt-5">
          <div className="space-y-5">
            <div
              className={tab === "Playlist" || tab === "Singer" ? "hidden" : ""}
            >
              <Title
                variant={"h3"}
                className={tab !== "All" ? "hidden" : ""}
                title="Songs"
              />

              {isFetching && songItemSkeleton}

              {!isFetching && result.songs.length ? (
                <SongList setSong={_handleSetSong} songs={result.songs} />
              ) : (
                <NotFound className="mx-auto" variant="less" />
              )}
            </div>

            <div className={tab === "Song" || tab === "Singer" ? "hidden" : ""}>
              <Title
                variant={"h3"}
                className={tab !== "All" ? "hidden" : ""}
                title="Playlist"
              />
              <PlaylistList loading={isFetching} playlists={result.playlists} />
            </div>

            <div
              className={tab === "Song" || tab === "Playlist" ? "hidden" : ""}
            >
              <Title
                variant={"h3"}
                className={tab !== "All" ? "hidden" : "mb-3"}
                title="Singers"
              />

              <SingerList
                singers={result.singers}
                loading={isFetching}
                skeNumber={2}
              />
            </div>
          </div>
        </div>
      </SongSelectProvider>

      <Footer />
    </>
  );
}
