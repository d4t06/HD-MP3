import { NotFound, Skeleton, Tab } from "@/components";
import Title from "@/components/ui/Title";
import { Link } from "react-router-dom";
import { SearchBar } from "../_components";
import AddSingerBtn from "./_components/AddSingerBtn";
import useDashboardSinger from "./_hooks/useDashboardSinger";
import DashboardTable from "../_components/ui/Table";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

export default function DashboardSingerPage() {
  const { isFetching, singers, tabs, tab, setTab, ...rest } = useDashboardSinger();

  return (
    <div className="pb-[46px]">
      <Title title="Singer" />

      <div className="flex justify-between mt-3">
        <SearchBar {...rest} />
        <AddSingerBtn />
      </div>

      <div
        className={`mt-5 w-fit self-start`}
      >
        <Tab disable={tab === 'All'} tabs={tabs} render={(t) => t} tab={tab} setTab={setTab} />
      </div>

      <div className="mt-3">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <DashboardTable colList={["Name", "Like"]}>
            {singers.length ? (
              singers.map((s, i) => (
                <tr key={i}>
                  <td>
                    <Link className="hover:underline" to={`/dashboard/singer/${s.id}`}>
                      {s.name}
                    </Link>
                  </td>

                  <td>{abbreviateNumber(s.like)}</td>
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
      </div>
    </div>
  );
}
