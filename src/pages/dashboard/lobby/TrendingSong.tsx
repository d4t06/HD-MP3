import useGetTrendingSongs from "@/modules/trending-song/useGetTrending";
import DashboardTable from "../_components/ui/Table";
import { Link } from "react-router-dom";
import { NotFound } from "@/components";
import { Loading } from "../_components";

export default function TrendingSong() {
  const { songs, isFetching } = useGetTrendingSongs({ amount: 5 });

  return (
    <>
      <h1 className="text-xl font-bold text-[#333]">Trending song now</h1>

      {isFetching && <Loading />}

      {!isFetching && (
        <DashboardTable colList={["Name", "Singers", "Today plays"]}>
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
                <td>{s.today_play}</td>
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
    </>
  );
}
