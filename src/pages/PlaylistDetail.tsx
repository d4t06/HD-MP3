import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { BackBtn, Skeleton } from "../components";
import { useSelector } from "react-redux";
import { usePlaylistDetail } from "@/hooks";
import { useMemo } from "react";
import PLaylistInfo from "@/components/PlaylistInfo";
import { SongItemSkeleton } from "@/components/skeleton";
import PlaylistDetailSongList from "@/components/PlaylistDetailSongList";
import SongListMain from "@/components/SongListMain";
import { useLocation } from "react-router-dom";
// import PlaylistProvider from "../store/PlaylistSongContext";

export default function PlaylistDetail() {
   // us store
   const { currentPlaylist } = useSelector(selectCurrentPlaylist);
   // hooks
   const { loading: usePlaylistLoading } = usePlaylistDetail();
   const location = useLocation();

   const isInDashboard = useMemo(
      () => location.pathname.includes("/dashboard/playlist"),
      [location]
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

      if (isInDashboard) return <PlaylistDetailSongList location="dashboard-playlist" />;

      if (currentPlaylist.by === "admin")
         return <PlaylistDetailSongList location="admin-playlist" />;
      else return <PlaylistDetailSongList location="my-playlist" />;
   }, [usePlaylistLoading]);

   return (
      <div className="min-h-screen">
         <BackBtn />

         {renderPlaylistInfo}
         <div className="pb-[50px] mt-[30px]">
            <SongListMain>{renderSongList}</SongListMain>
         </div>
      </div>
   );
}
