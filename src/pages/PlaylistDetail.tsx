import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { BackBtn } from "../components";
import { useSelector } from "react-redux";
import { usePlaylistDetail } from "@/hooks";
import PLaylistInfo from "@/components/PlaylistInfo";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import Footer from "@/components/Footer";
import useGetPlaylist from "@/hooks/useGetPlaylist";
import { useMemo } from "react";

export default function PlaylistDetail() {
  // us store
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  const isAdminPlaylist = useMemo(
    () => currentPlaylist?.by === "admin",
    [currentPlaylist]
  );

  //   hooks
  usePlaylistDetail({});
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
    <div className={`pb-[80px]`}>
      <div className="mb-[30px]">
        {/* <BackBtn variant={isAdminPlaylist ? "sys-playlist" : "my-playlist"} /> */}
      </div>

      {renderPlaylistInfo()}
      <div className="mt-[30px]">{renderSongList()}</div>
      <Footer />
    </div>
  );
}
