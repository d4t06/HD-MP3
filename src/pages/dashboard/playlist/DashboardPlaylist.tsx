import { Button } from "@/components";
import Title from "@/components/ui/Title";
import { useTheme } from "@/store";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AddNewPlaylistBtn from "./AddNewPlaylistBtn";
import useDashboardPlaylist from "../_hooks/useDashboardPlaylist";

export default function DashboardPlaylist() {
  const { theme } = useTheme();

  const { value, setValue, isFetching } = useDashboardPlaylist();

  const classes = {
    formGroup: ` flex  bg-${theme.alpha} rounded-full overflow-hidden`,
    input: "outline-none bg-transparent px-3 py-1 h-full",
  };

  return (
    <>
      <Title title="Playlists" />

      <div className="flex items-stretch justify-between mt-3">
        <form action="#" className={`flex`}>
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
    </>
  );
}
