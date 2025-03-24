import { NotFound, Skeleton, Tab } from "@/components";
import Title from "@/components/ui/Title";
import useDashboardPlaylist from "./_hooks/useDashboardPlaylist";
import Table from "@/components/ui/Table";
import { Link } from "react-router-dom";
import { Frame, SearchBar } from "../_components";
import AddNewPlaylistBtn from "./_components/AddNewPlaylistBtn";

export default function DashboardPlaylist() {
  const { isFetching, playlists, tab, tabs, setTab, ...rest } = useDashboardPlaylist();

  return (
    <div className="pb-[46px]">
      <Title title="Playlists" />

      <div className="flex justify-between mt-3">
        <SearchBar {...rest} />
        <AddNewPlaylistBtn />
      </div>

      <div className={`mt-5 w-fit ${tab === "All" ? "pointer-events-none" : ""} self-start`}>
        <Tab tabs={tabs} render={(t) => t} tab={tab} setTab={setTab} />
      </div>

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
    </div>
  );
}
