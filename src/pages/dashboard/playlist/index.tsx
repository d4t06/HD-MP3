import { Button, Tabs } from "@/components";
import Title from "@/components/ui/Title";
import { useThemeContext } from "@/stores";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useDashboardPlaylist from "./_hooks/useDashboardPlaylist";
import Table from "@/components/ui/Table";
import { Link } from "react-router-dom";
import AddNewPlaylistBtn from "@/components/dashboard/AddNewPlaylistBtn";

export default function DashboardPlaylist() {
  const { theme } = useThemeContext();

  const { value, setValue, isFetching, handleSubmit, playlists, tab, setTab } =
    useDashboardPlaylist();

  const classes = {
    formGroup: ` flex ${theme.side_bar_bg} rounded-full overflow-hidden`,
    input: "outline-none bg-transparent px-3 py-1 h-full",
  };

  return (
    <>
      <Title title="Playlists" />

      <div className="flex items-stretch justify-between mt-3">
        <form action="#" onSubmit={handleSubmit} className={`flex`}>
          <div className={`${classes.formGroup}`}>
            <input
              value={value}
              placeholder="..."
              onChange={(e) => setValue(e.target.value.trim())}
              className={`${classes.input}`}
              type="text"
            />
            <button
              type="button"
              onClick={() => setValue("")}
              className={`pr-2 ${
                !value ? "opacity-0 cursor-none" : "opacity-[1] cursor-pointer"
              }`}
            >
              <XMarkIcon className="w-5" />
            </button>
          </div>

          <Button
            type="submit"
            className={`${theme.content_bg} ml-3 w-[32px] justify-center h-full rounded-full `}
            size={"clear"}
          >
            <MagnifyingGlassIcon className="w-5" />
          </Button>
        </form>
        <AddNewPlaylistBtn />
      </div>

      <Tabs
        className={`mt-5 ${tab === "All" ? "pointer-events-none" : ""}`}
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
          <div className={`rounded-md ${theme.side_bar_bg}`}>
            <Table className="[&_td]:text-sm [&_tr]:border-b [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2" colList={["Name", "Played", "Songs", "Date", ""]}>
              {playlists.length ? playlists.map((p,i) => (
                <tr className="hover:bg-black/10" key={i}>
                  <td>
                    <Link to={`/dashboard/playlists/${p.id}`}>{p.name}</Link>
                  </td>
                  <td>-</td>
                  <td>-</td>

                  <td>-</td>
                  <td>-</td>
                </tr>
              )) : <tr>
                <td colSpan={5} className="text-center">...</td>
              </tr>}
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

