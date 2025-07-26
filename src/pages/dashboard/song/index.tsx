import Title from "@/components/ui/Title";
import useDashboardSong from "./_hooks/useDashboardSong";
import { NotFound, Tab } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import Searchbar from "../_components/SearchBar";
import { Button, DashboardSongItem } from "../_components";
import DashboardTable from "../_components/ui/Table";
import { useSongContext } from "@/stores";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

export default function DashboardSong() {
  const { hasMore, uploadedSongs } = useSongContext();

  const { isFetching, getSong, searchResult, tabs, setTab, tab, ...rest } =
    useDashboardSong();

  const songsSource = useMemo(
    () => (tab === "All" ? uploadedSongs : searchResult),
    [tab, uploadedSongs, searchResult],
  );

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
          {songsSource.length ? (
            <>
              {songsSource.map((s, i) => (
                <DashboardSongItem variant="songs" key={i} song={s} />
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
                    <Button disabled={!hasMore} onClick={getSong}>
                      Get more
                    </Button>
                  </td>
                </tr>
              )}
            </>
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                <NotFound />
              </td>
            </tr>
          )}
        </DashboardTable>
      </div>
    </div>
  );
}
