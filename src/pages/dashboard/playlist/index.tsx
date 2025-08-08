import { NotFound, Tab } from "@/components";
import Title from "@/components/ui/Title";
import useDashboardPlaylist from "./_hooks/useDashboardPlaylist";
import { Link } from "react-router-dom";
import { Button, SearchBar } from "../_components";
import AddNewPlaylistBtn from "./_components/AddNewPlaylistBtn";
import DashboardTable from "../_components/ui/Table";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { usePlaylistsContext } from "@/stores/dashboard/PlaylistContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

export default function DashboardPlaylist() {
  const { playlists, hasMore } = usePlaylistsContext();

  const { isFetching, getPlaylists, searchResult, tab, tabs, setTab, ...rest } =
    useDashboardPlaylist();

  const playlistsSource = useMemo(
    () => (tab === "All" ? playlists : searchResult),
    [tab, playlists, searchResult],
  );

  return (
    <>
      {/* <DashboardPageWrapper> */}
      <Title title="Playlists" />

      <div className="flex justify-between mt-3">
        <SearchBar loading={tab === "Result" && isFetching} {...rest} />
        <AddNewPlaylistBtn />
      </div>

      <div className={`mt-5 w-fit self-start`}>
        <Tab
          disable={tab === "All"}
          tabs={tabs}
          render={(t) => t}
          tab={tab}
          setTab={setTab}
        />
      </div>

      <div className="mt-3">
        <DashboardTable colList={["Name", "Like", ""]}>
          {playlistsSource.length ? (
            <>
              {playlistsSource.map((p, i) => (
                <tr key={i}>
                  <td>
                    <Link
                      className="hover:underline"
                      to={`/dashboard/playlist/${p.id}`}
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td>{abbreviateNumber(p.like)}</td>
                  <td>-</td>
                </tr>
              ))}

              {tab === "All" && isFetching && (
                <tr className="no-hover border-none">
                  <td colSpan={9}>
                    <ArrowPathIcon className="animate-spin w-7 mx-auto" />
                  </td>
                </tr>
              )}

              {tab === "All" && (
                <tr className="no-hover">
                  <td colSpan={9} className="text-center hover:bg-none">
                    <Button disabled={!hasMore} onClick={getPlaylists}>
                      Get more
                    </Button>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={4}>
                <NotFound />
              </td>
            </tr>
          )}
        </DashboardTable>
      </div>
      {/* </DashboardPageWrapper> */}
    </>
  );
}
