import { NotFound, PageWrapper, PlaylistList, Tab, Title } from "@/components";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetSearchResult from "./_hooks/useGetSearchResult";
import SongList from "@/modules/song-item/_components/SongList";
import Search from "@/modules/search";
import { useThemeContext } from "@/stores";
import Footer from "@/layout/primary-layout/_components/Footer";
import SingerList from "@/components/ui/SingerList";
import useGetRelativeSongs from "@/modules/song-queue/_hooks/useGetRelativeSongs";
import { SongSkeleton } from "@/components/skeleton";
import { pushRecentSearch } from "@/modules/search/_hooks/pushRecentSearch";

export default function SearchResultPage() {
  const { isOnMobile } = useThemeContext();
  const { isFetching, key, setIsFetching, result, tab, setTab, tabs } =
    useGetSearchResult();

  const { handleSetSong } = useSetSong({ variant: "search-bar" });
  const { getRelatigeSongs } = useGetRelativeSongs();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
    getRelatigeSongs(song);

    pushRecentSearch({
      variant: "song",
      item: song,
    });
  };

  const isNotFoundAtAll =
    !result.playlists.length && !result.singers.length && !result.songs.length;

  const getShowWhen = (t: typeof tab) => {
    return tab === "All" || tab === t ? "" : "hidden";
  };

  const titleClass = (isHasResult: boolean) =>
    tab !== "All" || (tab === "All" && !isHasResult) ? "hidden" : "mb-3";

  return (
    <>
      <PageWrapper className="space-y-8">
        {isOnMobile && <Search />}

        <div className="md:flex items-center">
          <Title title="Result" className="mt-1 md:mt-0" />
          <Tab
            className="w-fit [&_button]:text-sm mt-3 md:[&_button]:text-base md:mt-0 md:ml-4"
            tabs={tabs}
            render={(t) => t}
            tab={tab}
            disable={isNotFoundAtAll || !key}
            setTab={(t) => {
              setTab(t);
              setIsFetching(true);
            }}
          />
        </div>

        <SongSelectProvider>
          <div className="space-y-5">
            <div className={getShowWhen("Song")}>
              <Title
                variant={"h3"}
                className={titleClass(!!result.songs.length)}
                title="Songs"
              />

              {isFetching && <SongSkeleton />}

              {!isFetching && (
                <>
                  {result.songs.length ? (
                    <SongList setSong={_handleSetSong} songs={result.songs} />
                  ) : (
                    tab === "Song" && (
                      <NotFound variant="less" className="mx-auto" />
                    )
                  )}
                </>
              )}
            </div>

            <div className={getShowWhen("Playlist")}>
              <Title
                variant={"h3"}
                className={titleClass(!!result.playlists.length)}
                title="Playlist"
              />
              <PlaylistList
                whenEmpty={tab !== "Playlist" ? <></> : undefined}
                loading={isFetching}
                playlists={result.playlists}
                onClick={(p) =>
                  pushRecentSearch({
                    variant: "playlist",
                    item: p,
                  })
                }
              />
            </div>

            <div className={getShowWhen("Singer")}>
              <Title
                variant={"h3"}
                className={titleClass(!!result.singers.length)}
                title="Singers"
              />

              <SingerList
                singers={result.singers}
                loading={isFetching}
                skeNumber={2}
                onClick={(s) =>
                  pushRecentSearch({
                    variant: "singer",
                    item: s,
                  })
                }
                whenEmpty={tab === "All" ? <></> : undefined}
              />
            </div>
          </div>
        </SongSelectProvider>

        {!isFetching && isNotFoundAtAll && key && <NotFound />}
      </PageWrapper>

      <Footer />
    </>
  );
}
