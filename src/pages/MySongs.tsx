import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// store
import {
   useTheme,
   selectAllSongStore,
   useSongsStore,
   useAuthStore,
   useUpload,
} from "../store";

// hooks
import { useInitSong } from "../hooks";

import { BackBtn } from "../components";
import { routes } from "../routes";

import PlaylistList from "../components/PlaylistList";
import { PlusIcon } from "@heroicons/react/20/solid";
import SongListMain from "../components/SongListMain";
import usePlaylistActions from "../hooks/usePlaylistActions";
import MySongSongsList from "../components/MySongSongsList";

export default function MySongsPage() {
   // store
   const { theme } = useTheme();
   const { loading: userLoading, user } = useAuthStore();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { userPlaylists } = useSongsStore();

   // use hooks
   const { status } = useUpload();
   const navigate = useNavigate();
   const { loading: initialLoading, errorMsg, initial } = useInitSong({});
   const { addPlaylist, isFetching } = usePlaylistActions();

   // route guard
   useEffect(() => {
      if (userLoading) return;
      if (!user) return;

      if (!user.email) {
         navigate(routes.Home);
         console.log(">>> navigate to home");
      }
   }, [userLoading, initial]);

   if (errorMsg) return <h1>{errorMsg}</h1>;

   return (
      <>
         <div className="pb-[30px] ">
            {window.innerWidth < 800 && <BackBtn to="" />}
            <h3 className="text-[24px] font-bold mb-[14px]">Playlist</h3>

            <PlaylistList
               activeCondition={!!songInStore?.song_in}
               loading={initialLoading}
               playlist={userPlaylists}
               location="my-songs"
               addPlaylist={addPlaylist}
               isFetching={isFetching}
            />
         </div>

         <div className="pb-[30px]">
            <div className="flex items-center justify-between">
               <h3 className="text-[24px] font-bold">Songs</h3>
               <label
                  className={`${theme.content_bg} ${
                     status === "uploading" || initialLoading
                        ? "opacity-60 pointer-events-none"
                        : ""
                  } items-center hover:opacity-60 rounded-full flex px-[16px] py-[4px] cursor-pointer`}
                  htmlFor="song_upload"
               >
                  <PlusIcon className="w-[20px] mr-[5px]" />
                  Upload
               </label>
            </div>

            <SongListMain>
               <MySongSongsList />
            </SongListMain>
         </div>
      </>
   );
}
