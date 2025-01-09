import { BackBtn } from "../components";
import { usePlaylistDetail } from "@/hooks";
import PLaylistInfo from "@/components/PlaylistInfo";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import Footer from "@/components/Footer";
import useGetPlaylist from "@/hooks/useGetPlaylist";

export default function DashboardPlaylist() {
  // us store

  //   hooks
  usePlaylistDetail({ admin: true });
  const { isFetching } = useGetPlaylist();

  return (
    <div className={`pb-[80px] pt-10`}>
      <div className="mb-[30px]">
        <BackBtn variant="dashboard-playlist" />
      </div>

      <PLaylistInfo loading={isFetching} variant="dashboard-playlist" />
      <div className="mt-[30px]">
        <PlaylistDetailSongList loading={isFetching} variant="dashboard-playlist" />
      </div>
      <Footer />
    </div>
  );
}
