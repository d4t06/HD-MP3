import { Loading } from "@/pages/dashboard/_components";
import { useGetSongs } from "@/hooks";
import { useCategoryContext } from "../CategoryContext";
import { useMemo } from "react";
import SongCta from "./SongCta";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { NotFound } from "@/components";
import { Link } from "react-router-dom";

export default function SongSection() {
  const { setSongs, category, songs } = useCategoryContext();

  const songIds = useMemo(
    () => (category?.song_ids ? category.song_ids.split("_") : []),
    [category],
  );

  const { isFetching } = useGetSongs({ setSongs, songIds });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#333]">Songs</h1>

        <SongCta />
      </div>
      {/* <Frame> */}
      {isFetching && <Loading />}
      {!isFetching && (
        <DashboardTable colList={["Name", "Singers", ""]}>
          {songs.length ? (
            songs.map((s, i) => (
              <tr key={i}>
                <td>
                  <Link
                    to={`/dashboard/song/${s.id}/edit`}
                    className="hover:underline"
                  >
                    {s.name}
                  </Link>
                </td>
                <td>
                  {s.singers.map((s, i) => (
                    <Link
                      className="hover:underline"
                      to={`/dashboard/singer/${s.id}`}
                      key={i}
                    >
                      {!!i && ", "}
                      {s.name}
                    </Link>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
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
