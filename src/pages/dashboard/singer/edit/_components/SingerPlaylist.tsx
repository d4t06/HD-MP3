import { NotFound, Skeleton, Title } from "@/components";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { Link } from "react-router-dom";
import { useGetSingerContext } from "./GetSingerContext";

export default function SingerPlaylist() {
  const { playlists } = useSingerContext();
  const { isFetching } = useGetSingerContext();

  return (
    <>
      <Title title="Playlists" />

      {isFetching && <Skeleton className="h-[100px]" />}

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
