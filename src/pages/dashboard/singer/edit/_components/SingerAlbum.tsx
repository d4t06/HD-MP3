import { Link } from "react-router-dom";
import { useGetSingerContext } from "./GetSingerContext";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { NotFound, Skeleton, Title } from "@/components";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";

export default function SingerAlbum() {
  const { albums } = useSingerContext();
  const { isFetching } = useGetSingerContext();

  return (
    <>
      <Title title="Albums" />

      {isFetching && <Skeleton className="h-[100px]" />}

      {!isFetching && (
        <DashboardTable colList={["Name", ""]}>
          {albums.length ? (
            albums.map((p, i) => (
              <tr className="hover:bg-black/10" key={i}>
                <td>
                  <Link to={`/dashboard/album/${p.id}`}>{p.name}</Link>
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
