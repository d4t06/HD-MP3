import { NotFound, Tabs } from "@/components";
import Title from "@/components/ui/Title";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Table from "@/components/ui/Table";
import { Link } from "react-router-dom";
import { Frame, SearchBar } from "../_components";
import AddSingerBtn from "./_components/AddSingerBtn";
import useDashboardSinger from "./_hooks/useDashboardSinger";
import DashBoard from "../Dashboard";
import DashboardTable from "../_components/ui/Table";

export default function DashboardSingerPage() {
  const { isFetching, singers, tab, setTab, ...rest } = useDashboardSinger();

  return (
    <>
      <Title title="Playlists" />

      <div className="flex justify-between">
        <SearchBar className="self-start mt-3" {...rest} />
        <AddSingerBtn />
      </div>

      <Tabs
        className={`mt-5 ${tab === "All" ? "pointer-events-none" : ""} self-start`}
        tabs={["All", "Result"]}
        render={(t) => t}
        activeTab={tab}
        setActiveTab={setTab}
      />

      <div className="mt-3">
        {isFetching && (
          <p className="text-center w-full">
            <ArrowPathIcon className="w-6 animate-spin inline-block" />
          </p>
        )}

        {!isFetching && (
          <DashboardTable colList={["Name", ""]}>
            {singers.length ? (
              singers.map((s, i) => (
                <tr className="hover:bg-black/10" key={i}>
                  <td>
                    <Link to={`/dashboard/singer/${s.id}`}>{s.name}</Link>
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
      </div>
    </>
  );
}
