import { NotFound, Tab } from "@/components";
import Title from "@/components/ui/Title";
import { Link } from "react-router-dom";
import { Button, SearchBar } from "../_components";
import AddSingerBtn from "./_components/AddSingerBtn";
import useDashboardSinger from "./_hooks/useDashboardSinger";
import DashboardTable from "../_components/ui/Table";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { useMemo } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSingerContext } from "@/stores/dashboard/SingerContext";

export default function DashboardSingerPage() {
  const { hasMore, singers } = useSingerContext();

  const { isFetching, result, getSingers, tabs, tab, setTab, ...rest } =
    useDashboardSinger();

  const singerSource = useMemo(
    () => (tab === "All" ? singers : result),
    [tab, singers, result],
  );

  return (
    <>
      {/* <DashboardPageWrapper> */}
      <Title title="Singers" />

      <div className="flex justify-between mt-3">
        <SearchBar loading={tab === "Result" && isFetching} {...rest} />
        <AddSingerBtn />
      </div>

      <div className={`mt-5 w-fit self-start`}>
        <Tab
          disable={tab === "All"}
          tabs={tabs}
          render={(t) => t}
          tab={tab}
          setTab={setTab}
        />
      </div>

      <div className="mt-3">
        <DashboardTable colList={["Name", "Like"]}>
          {singerSource.length ? (
            <>
              {singerSource.map((s, i) => (
                <tr key={i}>
                  <td>
                    <Link
                      className="hover:underline"
                      to={`/dashboard/singer/${s.id}`}
                    >
                      {s.name}
                    </Link>
                  </td>

                  <td>{abbreviateNumber(s.like)}</td>
                </tr>
              ))}

              {isFetching && (
                <tr className="no-hover border-none">
                  <td colSpan={9}>
                    <ArrowPathIcon className="animate-spin w-7 mx-auto" />
                  </td>
                </tr>
              )}

              {tab === "All" && (
                <tr className="no-hover">
                  <td colSpan={9} className="text-center hover:bg-none">
                    <Button disabled={!hasMore} onClick={getSingers}>
                      Get more
                    </Button>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={2}>
                <NotFound />
              </td>
            </tr>
          )}
        </DashboardTable>
      </div>
      {/* </DashboardPageWrapper> */}
    </>
  );
}
