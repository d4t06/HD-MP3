import Title from "@/components/ui/Title";
import useDashboardSong from "./_hooks/useDashboardSong";
import Table from "@/components/ui/Table";
import { NotFound, Skeleton, Tabs } from "@/components";
import { useThemeContext } from "@/stores";
import { PlusIcon } from "@heroicons/react/20/solid";
import Searchbar from "../_components/SearchBar";
import { Button, DashboardSongItem, Frame } from "../_components";

export default function DashboardSong() {
  const { theme } = useThemeContext();

  const { isFetching, uploadedSongs, setTab, tab, ...rest } = useDashboardSong();

  return (
    <>
      <Title title="Songs" />

      <div className="flex justify-between items-end mt-3">
        <Searchbar {...rest} />
        <Button
          href="/dashboard/song/add-song"
          className={`p-1.5`}
          size={"clear"}
        >
          <PlusIcon className="w-6" />
          <div className="hidden md:block">Add song</div>
        </Button>
      </div>

      <Tabs
        className={`mt-5 ${tab === "All" ? "pointer-events-none" : ""} self-start`}
        tabs={["All", "Result"]}
        render={(t) => t}
        activeTab={tab}
        setActiveTab={setTab}
      />

      <div className="mt-3">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <Frame>
            <div className={`rounded-md overflow-hidden`}>
              <Table
                className="[&_td]:text-sm [&_tbody>tr]:border-t [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2"
                colList={["Name", "Singer", ""]}
              >
                {uploadedSongs.length ? (
                  uploadedSongs.map((s, i) => (
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
    </>
  );
}
