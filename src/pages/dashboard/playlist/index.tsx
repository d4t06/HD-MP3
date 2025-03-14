import { NotFound, Skeleton, Tabs } from "@/components";
import Title from "@/components/ui/Title";
import useDashboardPlaylist from "./_hooks/useDashboardPlaylist";
import Table from "@/components/ui/Table";
import { Link } from "react-router-dom";
import { Frame, SearchBar } from "../_components";
import AddNewPlaylistBtn from "./_components/AddNewPlaylistBtn";

export default function DashboardPlaylist() {
  const { isFetching, playlists, tab, setTab, ...rest } = useDashboardPlaylist();

  return (
    <>
      <Title title="Playlists" />

      <div className="flex justify-between">
        <SearchBar className="self-start mt-3" {...rest} />
        <AddNewPlaylistBtn />
      </div>

      <Tabs
        className={`mt-5 ${tab === "All" ? "pointer-events-none" : ""} self-start`}
        tabs={["All", "Result"]}
        render={(t) => t}
        activeTab={tab}
        setActiveTab={setTab}
      />

      <div className="mt-3">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <Frame>
            <div className={`rounded-md overflow-hidden`}>
              <Table
                className="[&_td]:text-sm [&_tbody>tr]:border-t [&_tr]:border-black/5 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2"
                colList={["Name", "Played", "Songs", ""]}
              >
                {playlists.length ? (
                  playlists.map((p, i) => (
                    <tr className="hover:bg-black/10" key={i}>
                      <td>
                        <Link to={`/dashboard/playlist/${p.id}`}>{p.name}</Link>
                      </td>
                      <td>-</td>
                      <td>-</td>

                      <td>-</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <NotFound />
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          </Frame>
        )}
      </div>
    </>
  );
}
