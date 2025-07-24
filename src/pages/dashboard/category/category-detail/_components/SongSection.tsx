import {
  DashboardSongItem,
  Frame,
  Loading,
} from "@/pages/dashboard/_components";
import { useGetSongs } from "@/hooks";
import { useCategoryContext } from "../CategoryContext";
import { useMemo } from "react";
import SongCta from "./SongCta";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { NotFound } from "@/components";

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
        <h1 className="text-xl font-bold text-gray-600">Songs</h1>

        <SongCta />
      </div>
      {/* <Frame> */}
        {isFetching && <Loading />}
        {!isFetching && (
          <DashboardTable
            colList={[
              "Name",
              "Singers",
              "Main genre",
              "Genres",
              "Like",
              "Today plays",
              "Week plays",
            ]}
          >
            {songs.length ? (
              songs.map((s, i) => (
                <DashboardSongItem
                  hasMenu={false}
                  variant="songs"
                  key={i}
                  song={s}
                />
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
