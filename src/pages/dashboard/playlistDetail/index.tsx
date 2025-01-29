import PLaylistInfo from "@/components/PlaylistInfo";
import useGetPlaylist from "@/hooks/useGetPlaylist";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Table from "@/components/ui/Table";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { useTheme } from "@/store";
// import useDashboardPlaylistActions from "@/hooks/dashboard/useDashboardPlaylistActions";
import DashboardSongItem from "@/components/dashboard/DashboardSongItem";

export default function DashboardPlaylistDetail() {
  const { theme } = useTheme();

  //   hooks
  const { isFetching } = useGetPlaylist();
  const { playlistSongs } = useSelector(selectCurrentPlaylist);
  // const { actions,  } = useDashboardPlaylistActions();

  // const handleRemoveSong = (s: Song) => {
  //   actions({ variant: "remove-song", song: s });
  // };

  return (
    <div className="lg:flex lg:-mx-3 overflow-hidden">
      <div className="w-full lg:w-1/4 lg:px-3">
        <PLaylistInfo loading={isFetching} variant="dashboard-playlist" />
      </div>
      <div className="w-full lg:w-3/4 lg:px-3 lg:overflow-auto">
        {isFetching && (
          <p className="text-center w-full">
            <ArrowPathIcon className="w-6 animate-spin inline-block" />
          </p>
        )}

        {!isFetching && (
          <div className={`rounded-md overflow-hidden ${theme.side_bar_bg}`}>
            <Table
              className="[&_td]:text-sm [&_tr]:border-b [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2 hover:[&_tr:not(div.absolute)]:bg-black/10"
              colList={["Name", "Singer", "Genre", "Time", ""]}
            >
              {playlistSongs.map((s, i) => (
                <DashboardSongItem variant="playlist" key={i} song={s} />
              ))}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
