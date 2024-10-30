import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { BackBtn } from "../components";
import { useSelector } from "react-redux";
import { usePlaylistDetail } from "@/hooks";
import PLaylistInfo from "@/components/PlaylistInfo";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import Footer from "@/components/Footer";
import useGetPlaylist from "@/hooks/useGetPlaylist";

export default function PlaylistDetail() {
  // us store
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  //   hooks
  usePlaylistDetail({});
  const { isFetching } = useGetPlaylist();

  const renderPlaylistInfo = () => {
    if (currentPlaylist?.by === "admin")
      return <PLaylistInfo loading={isFetching} variant="admin-playlist" />;

    return <PLaylistInfo loading={isFetching} variant="my-playlist" />;
  };

  const renderSongList = () => {
    if (currentPlaylist?.by === "admin")
      return <PlaylistDetailSongList loading={isFetching} variant="admin-playlist" />;
    else return <PlaylistDetailSongList loading={isFetching} variant="my-playlist" />;
  };

  return (
    <div className={`pb-[80px]`}>
      <div className="mb-[30px]">
        <BackBtn />
      </div>

      {renderPlaylistInfo()}
      <div className="mt-[30px]">{renderSongList()}</div>
      <Footer />
    </div>
  );
}
