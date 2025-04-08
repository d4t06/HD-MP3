import { NotFound, Skeleton, Tab } from "@/components";
import Title from "@/components/ui/Title";
import useDashboardPlaylist from "./_hooks/useDashboardPlaylist";
import { Link } from "react-router-dom";
import { SearchBar } from "../_components";
import AddNewPlaylistBtn from "./_components/AddNewPlaylistBtn";
import DashboardTable from "../_components/ui/Table";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

export default function DashboardPlaylist() {
  const { isFetching, playlists, tab, tabs, setTab, ...rest } = useDashboardPlaylist();

  return (
    <div className="pb-[46px]">
      <Title title="Playlists" />

      <div className="flex justify-between mt-3">
        <SearchBar {...rest} />
        <AddNewPlaylistBtn />
      </div>

      <div
        className={`mt-5 w-fit ${tab === "All" ? "pointer-events-none" : ""} self-start`}
      >
        <Tab tabs={tabs} render={(t) => t} tab={tab} setTab={setTab} />
      </div>

      <div className="mt-3">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <DashboardTable colList={["Name", "Like", ""]}>
            {playlists.length ? (
              playlists.map((p, i) => (
                <tr key={i}>
                  <td>
                    <Link className="hover:underline" to={`/dashboard/playlist/${p.id}`}>
                      {p.name}
                    </Link>
                  </td>
                  <td>{abbreviateNumber(p.like)}</td>
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
          </DashboardTable>
        )}
      </div>
    </div>
  );
}
