import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { BackBtn, Skeleton } from "../components";
import { useSelector } from "react-redux";
import { usePlaylistDetail } from "@/hooks";
import { useMemo } from "react";
import PLaylistInfo from "@/components/PlaylistInfo";
import { SongItemSkeleton } from "@/components/skeleton";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import { useLocation } from "react-router-dom";

export default function PlaylistDetail() {
   // us store
   const { currentPlaylist } = useSelector(selectCurrentPlaylist);
   // hooks
   const { loading: usePlaylistLoading } = usePlaylistDetail();
   const variant = useLocation();

   const isInDashboard = useMemo(
      () => variant.pathname.includes("/dashboard/playlist"),
      [variant]
   );

   const renderPlaylistInfo = useMemo(() => {
      if (isInDashboard)
         return <PLaylistInfo loading={usePlaylistLoading} type="dashboard-playlist" />;

      if (currentPlaylist.by === "admin")
         return <PLaylistInfo loading={usePlaylistLoading} type="admin-playlist" />;

      return <PLaylistInfo loading={usePlaylistLoading} type="my-playlist" />;
   }, [usePlaylistLoading]);

   const renderSongList = useMemo(() => {
      if (usePlaylistLoading)
         return (
            <>
               <div className="h-[30px] mb-[10px] flex items-center">
                  <Skeleton className="h-[20px] w-[90px]" />
               </div>

               {SongItemSkeleton}
            </>
         );

      if (isInDashboard) return <PlaylistDetailSongList variant="dashboard-playlist" />;

      if (currentPlaylist.by === "admin")
         return <PlaylistDetailSongList variant="admin-playlist" />;
      else return <PlaylistDetailSongList variant="my-playlist" />;
   }, [usePlaylistLoading]);

   return (
      <div className="min-h-screen">
         <BackBtn />

         {renderPlaylistInfo}
         <div className="pb-[50px] mt-[20px]">{renderSongList}</div>
      </div>
   );
}
