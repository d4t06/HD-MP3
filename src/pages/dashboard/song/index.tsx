import Title from "@/components/ui/Title";
import useDashboardSong from "./_hooks/useDashboardSong";
import Table from "@/components/ui/Table";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { NotFound, Tabs } from "@/components";
import { useThemeContext } from "@/stores";
import DashboardSongItem from "@/components/dashboard/DashboardSongItem";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Frame } from "@/components/dashboard";
import Searchbar from "@/components/dashboard/SearchBar";

export default function DashboardSong() {
  const { theme } = useThemeContext();

  const { isFetching, songs, setTab, tab, ...rest } = useDashboardSong();

  return (
    <>
      <Title title="Songs" />

      <Searchbar className="self-start mt-3" {...rest} />

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
          <Frame>
            <div className={`rounded-md overflow-hidden`}>
              <Table
                className="[&_td]:text-sm [&_tbody>tr]:border-t [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2"
                colList={["Name", "Singer", ""]}
              >
                {songs.length ? (
                  songs.map((s, i) => (
                    <DashboardSongItem
                      className={`hover:bg-${theme.alpha}`}
                      variant="songs"
                      key={i}
                      song={s}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      <NotFound />
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          </Frame>
        )}
      </div>

      <Button
        href="/dashboard/song/add-song"
        className={`!absolute right-[10px] bottom-5 p-1.5`}
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add song</div>
      </Button>
    </>
  );
}
