import { useMemo } from "react";
import { useSongsStore, useAuthStore } from "../store";

import { useInitSong } from "../hooks";
import PlaylistList from "../components/PlaylistList";
import MobileNav from "../components/MobileNav";
import MobileSetting from "../components/MobileSetting";
import HomeSongList from "../components/HomeSongList";

export default function HomePage() {
   // store
   const { loading: userLoading } = useAuthStore();
   const { adminPlaylists } = useSongsStore();

   // hooks
   const { loading: useSongLoading } = useInitSong({});

   const isOnMobile = useMemo(() => window.innerWidth < 800, []);

   return (
      <>
         {/* mobile nav */}
         {isOnMobile && <MobileNav />}
         <div className="pb-[30px]">
            <h3 className="text-[24px] font-bold mb-[14px]">Popular</h3>

            <PlaylistList
               loading={useSongLoading || userLoading}
               playlist={adminPlaylists}
               location="home"
            />
         </div>
         <div className="pb-[30px]">
            <HomeSongList loading={useSongLoading} />
         </div>

         {isOnMobile && <MobileSetting />}
      </>
   );
}
