import { usePlaylistDetail } from "@/hooks";
import PLaylistInfo from "@/components/PlaylistInfo";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import useGetPlaylist from "@/hooks/useGetPlaylist";
import Footer from "@/layout/_components/Footer";

export default function DashboardPlaylist() {
  //   hooks
  usePlaylistDetail({ admin: true });
  const { isFetching } = useGetPlaylist();

  return (
    <div className={`pb-[80px] pt-10`}>
      <PLaylistInfo loading={isFetching} variant="dashboard-playlist" />
      <div className="mt-[30px]">
        <PlaylistDetailSongList loading={isFetching} variant="dashboard-playlist" />
      </div>
      <Footer />
    </div>
  );
}
