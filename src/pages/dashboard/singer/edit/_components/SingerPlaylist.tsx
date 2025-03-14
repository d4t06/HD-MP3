import { NotFound, Skeleton, Title } from "@/components";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { Link } from "react-router-dom";

export default function SingerPlaylist() {
  const { isFetching, playlists } = useSingerContext();

  return (
    <>
      <Title title="Popular Playlists" />

      {isFetching && <Skeleton className="h-[200px]" />}

      {!isFetching && (
        <DashboardTable colList={["Name", ""]}>
          {playlists.length ? (
            playlists.map((p, i) => (
              <tr className="hover:bg-black/10" key={i}>
                <td>
                  <Link to={`/dashboard/playlist/${p.id}`}>{p.name}</Link>
                </td>

                <td>-</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>
                <NotFound />
              </td>
            </tr>
          )}
        </DashboardTable>
      )}
    </>
  );
}
