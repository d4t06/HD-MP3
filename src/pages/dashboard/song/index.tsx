import Title from "@/components/ui/Title";
import useDashboardSong from "./_hooks/useDashboardSong";
import { NotFound, Skeleton, Tab } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import Searchbar from "../_components/SearchBar";
import { Button, DashboardSongItem } from "../_components";
import DashboardTable from "../_components/ui/Table";

export default function DashboardSong() {
  const { isFetching, uploadedSongs, tabs, setTab, tab, ...rest } =
    useDashboardSong();

  return (
    <div className="pb-[46px]">
      <Title title="Songs" />

      <div className="flex justify-between items-start mt-3">
        <Searchbar {...rest} />
        <Button
          href="/dashboard/song/add-song"
          className={`p-1.5 ml-5`}
          size={"clear"}
        >
          <PlusIcon className="w-6" />
          <div className="hidden md:block">Add song</div>
        </Button>
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
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <DashboardTable colList={["Name", "Singer", "Like"]}>
            {uploadedSongs.length ? (
              uploadedSongs.map((s, i) => (
                <DashboardSongItem variant="songs" key={i} song={s} />
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
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
