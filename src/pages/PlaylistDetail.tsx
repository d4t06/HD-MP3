import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { BackBtn, Skeleton } from "../components";
import { useSelector } from "react-redux";
import { usePlaylistDetail } from "@/hooks";
import { useMemo } from "react";
import PLaylistInfo from "@/components/PlaylistInfo";
import { SongItemSkeleton } from "@/components/skeleton";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import useGetPlaylist from "@/hooks/useGetPlaylist";

export default function PlaylistDetail() {
  // us store
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  //   hooks
  usePlaylistDetail();
  const variant = useLocation();
  const { isFetching } = useGetPlaylist();

  const isInDashboard = useMemo(
    () => variant.pathname.includes("/dashboard/playlist"),
    [variant]
  );

  const renderPlaylistInfo = useMemo(() => {
    if (isInDashboard)
      return <PLaylistInfo loading={isFetching} type="dashboard-playlist" />;

    if (currentPlaylist?.by === "admin")
      return <PLaylistInfo loading={isFetching} type="admin-playlist" />;

    return <PLaylistInfo loading={isFetching} type="my-playlist" />;
  }, [isFetching]);

  const renderSongList = () => {
    if (isFetching)
      return (
        <>
          <div className="h-[30px] mb-[10px] flex items-center">
            <Skeleton className="h-[20px] w-[90px]" />
          </div>

          {SongItemSkeleton}
        </>
      );

    if (isInDashboard) return <PlaylistDetailSongList variant="dashboard-playlist" />;

    if (currentPlaylist?.by === "admin")
      return <PlaylistDetailSongList variant="admin-playlist" />;
    else return <PlaylistDetailSongList variant="my-playlist" />;
  };

  return (
    <div className="pb-[80px]">
      <div className="mb-[30px]">
        <BackBtn />
      </div>

      {renderPlaylistInfo}
      <div className="mt-[30px]">{renderSongList()}</div>
      <Footer />
    </div>
  );
}
