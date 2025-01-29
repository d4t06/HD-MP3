import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { useSelector } from "react-redux";
import { usePlaylistDetail } from "@/hooks";
import PLaylistInfo from "@/components/PlaylistInfo";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import useGetPlaylist from "@/hooks/useGetPlaylist";
import { useMemo } from "react";
import Footer from "@/layout/_components/Footer";

export default function PlaylistDetail() {
  // us store
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  const isAdminPlaylist = useMemo(
    () => currentPlaylist?.by === "admin",
    [currentPlaylist],
  );

  //   hooks
  usePlaylistDetail();
  const { isFetching } = useGetPlaylist();

  const renderPlaylistInfo = () => {
    if (isAdminPlaylist)
      return <PLaylistInfo loading={isFetching} variant="sys-playlist" />;

    return <PLaylistInfo loading={isFetching} variant="my-playlist" />;
  };

  const renderSongList = () => {
    if (isAdminPlaylist)
      return <PlaylistDetailSongList loading={isFetching} variant="sys-playlist" />;
    else return <PlaylistDetailSongList loading={isFetching} variant="my-playlist" />;
  };

  return (
    <>
      <div className="lg:flex lg:-mx-3">
        <div className="w-full lg:w-1/4 lg:px-3">{renderPlaylistInfo()}</div>
        <div className="w-full lg:w-3/4 lg:px-3">
          <div className="mt-[30px] lg:mt-0">{renderSongList()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
