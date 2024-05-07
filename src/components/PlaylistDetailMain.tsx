import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectAllSongStore } from "../store";
import { usePlaylistDetail } from "../hooks";
import { Skeleton } from "../components";

import SongListMain from "../components/SongListMain";
import PlaylistDetailSongList from "../components/PlaylistDetailSongList";
import PLaylistInfo from "../components/PlaylistInfo";
import { SongItemSkeleton } from "../components/skeleton";

export default function PlaylistDetailMain() {
   // us store
   const { playlist: playlistInStore } = useSelector(selectAllSongStore);
   // hooks
   const { loading: usePlaylistLoading } = usePlaylistDetail();

   const renderPlaylistInfo = useMemo(() => {
      if (playlistInStore.by === "admin")
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
      if (playlistInStore.by === "admin")
         return <PlaylistDetailSongList location="admin-playlist" />;
      else return <PlaylistDetailSongList location="my-playlist" />;
   }, [usePlaylistLoading]);

   return (
      <>
         {renderPlaylistInfo}
         <div className="pb-[50px] mt-[30px]">
            <SongListMain>{renderSongList}</SongListMain>
         </div>
      </>
   );
}
