import { Loading } from "@/pages/dashboard/_components";
import { useCategoryContext } from "../CategoryContext";
import { useGetPlaylists } from "@/hooks";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { NotFound } from "@/components";
import PlaylistCta from "./PlaylistCta";

export default function PlaylistSection() {
  const { setPlaylists, orderedPlaylists, playlistIds } =
    useCategoryContext();

  const { isFetching } = useGetPlaylists({ setPlaylists, playlistIds });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-600">Playlists</h1>

        <PlaylistCta />
      </div>
      {/* <Frame> */}
      {isFetching && <Loading />}
      {!isFetching && (
        <DashboardTable colList={["Name", "Like", ""]}>
          {orderedPlaylists.length ? (
            orderedPlaylists.map((p, i) => (
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
      {/* </Frame> */}
    </>
  );
}
