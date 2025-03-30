import { NotFound, Skeleton, Tab } from "@/components";
import Title from "@/components/ui/Title";
import { Link } from "react-router-dom";
import { SearchBar } from "../_components";
import AddNewAlbumBtn from "./_components/AddNewAlbumBtn";
import useDashboardAlbum from "./_hooks/useDashboardAlbum";
import DashboardTable from "../_components/ui/Table";

export default function DashboardAlbum() {
  const { isFetching, albums, tab, tabs, setTab, setAlbums, ...rest } =
    useDashboardAlbum();

  return (
    <div className="pb-[46px]">
      <Title title="Albums" />

      <div className="flex justify-between mt-3">
        <SearchBar {...rest} />
        <AddNewAlbumBtn setAlbums={setAlbums} />
      </div>

      <div
        className={`mt-5 w-fit ${tab === "All" ? "pointer-events-none" : ""} self-start`}
      >
        <Tab tabs={tabs} render={(t) => t} tab={tab} setTab={setTab} />
      </div>

      <div className="mt-3">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <DashboardTable colList={["Name", "Singer", ""]}>
            {albums.length ? (
              albums.map((p, i) => (
                <tr key={i}>
                  <td>
                    <Link className="hover:underline" to={`/dashboard/album/${p.id}`}>{p.name}</Link>
                  </td>
                  <td>
                    <Link to={`/dashboard/${p.singers[0].id}`}>{p.singers[0].name}</Link>
                  </td>
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
          </DashboardTable>
        )}
      </div>
    </div>
  );
}
