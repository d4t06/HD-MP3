import { NotFound, Title } from "@/components";
import SongSelectProvider from "@/stores/SongSelectContext";
import Skeleton from "@/components/skeleton";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { Link } from "react-router-dom";
import { useGetSingerContext } from "./GetSingerContext";

export default function SingerSongList() {
  const { songs } = useSingerContext();
  const { isFetching } = useGetSingerContext();

  return (
    <>
      <Title title="Songs" />
      <SongSelectProvider>
        {isFetching ? (
          <Skeleton className="h-[100px]" />
        ) : (
          <DashboardTable colList={["Name", "Singers", "Genres"]}>
            {songs.length ? (
              songs.map((song, i) => (
                <tr className="hover:bg-black/10" key={i}>
                  <td>
                    <Link to={`/dashboard/song/${song.id}/edit`}>
                      {song.name}
                    </Link>
                  </td>

                  <td>
                    {song.singers.map((s, i) => (
                      <Link
                        to={`/dashboard/singer/${s.id}`}
                        className={`hover:text-green-500 hover:underline`}
                        key={i}
                      >
                        {(i ? ", " : "") + s.name}
                      </Link>
                    ))}
                  </td>

                  <td>
                    {song.genres.map((genre, i) => (
                      <span key={i}>
                        {!!i && ", "}
                        {genre.name}
                      </span>
                    ))}
                  </td>
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
      </SongSelectProvider>
    </>
  );
}
