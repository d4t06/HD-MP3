import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRightIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import { Song } from "../types";

import { selectAllSongStore, setSong, useTheme, useSongsStore, useAuthStore } from "../store";
import { SongItem, Button, LinkItem, Skeleton, MobileSongItem } from "../components";
// hooks
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import {useSongs, useSongItemActions} from '../hooks'
// config
import { routes } from "../routes";
import { auth } from "../config/firebase";

export default function HomePage() {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { loading: useSongLoading } = useSongs();
   const { adminSongs, userPlaylists } = useSongsStore();
   const { song: songInStore } = useSelector(selectAllSongStore);

   // use hooks
   const songItemActions = useSongItemActions();
   const [signInWithGoogle] = useSignInWithGoogle(auth);

   // component states
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   // define callback functions
   const handleSetSong = (song: Song, index: number) => {
      if (songInStore.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index, song_in: "admin" }));
   };

   const isOnMobile = useMemo(() => window.innerWidth < 550, []);

   const signIn = () => {
      signInWithGoogle();
   };

   // define skeleton
   const menuItemSkeletons = [...Array(1).keys()].map((index) => {
      return <Skeleton key={index} className="w-full h-[40px] mb-[10px]" />;
   });

   const SongItemSkeleton = [...Array(4).keys()].map((index) => {
      return (
         <div className="flex items-center p-[10px]" key={index}>
            <Skeleton className="h-[18px] w-[18px]" />

            <Skeleton className="h-[54px] w-[54px] ml-[18px] rounded-[4px]" />
            <div className="ml-[10px]">
               <Skeleton className="h-[20px] mb-[5px] w-[150px]" />
               <Skeleton className="h-[12px] mt-[5px] w-[100px]" />
            </div>
         </div>
      );
   });

   // define jsx
   const renderAdminSongs = useMemo(() => {
      return adminSongs.map((song, index) => {
         const active = song.id === songInStore.id && songInStore.song_in === "admin";

         if (isOnMobile) {
            return (
               <div key={index} className="w-full max-[549px]:w-full">
                  <MobileSongItem
                     theme={theme}
                     onClick={() => handleSetSong(song, index)}
                     active={active}
                     key={index}
                     data={song}
                     isCheckedSong={isCheckedSong}
                     selectedSongList={selectedSongList}
                     setIsCheckedSong={setIsCheckedSong}
                     setSelectedSongList={setSelectedSongList}
                  />
               </div>
            );
         }
         return (
            <div key={index} className="w-full max-[549px]:w-full">
               <SongItem
                  theme={theme}
                  onClick={() => handleSetSong(song, index)}
                  active={active}
                  key={index}
                  data={song}
                  userInfo={userInfo}
                  isCheckedSong={isCheckedSong}
                  userPlaylists={userPlaylists}
                  selectedSongList={selectedSongList}
                  setIsCheckedSong={setIsCheckedSong}
                  setSelectedSongList={setSelectedSongList}
                  songItemActions={songItemActions}
               />
            </div>
         );
      });
   }, [adminSongs, theme, songInStore]);

   // define styles
   const classes = {
      icon: `w-6 h-6 mr-2 inline`,
   };

   return (
      <>
         {/* mobile nav */}
         {isOnMobile && (
            <div className="pb-[20px]">
               <div className="flex flex-col gap-3 items-start ">
                  <h1 className="text-[24px] font-bold">Library</h1>
                  {userInfo.status === "loading" ? (
                     menuItemSkeletons
                  ) : (
                     <>
                        {userInfo.email ? (
                           <>
                              <LinkItem
                                 className="py-[10px] border-b border-[#333]"
                                 to={routes.MySongs}
                                 icon={
                                    <MusicalNoteIcon
                                       className={classes.icon + theme.content_text}
                                    />
                                 }
                                 label="All songs"
                                 arrowIcon={<ChevronRightIcon className="w-5 h-5 text-gray-500" />}
                              />
                           </>
                        ) : (
                           <Button
                              onClick={signIn}
                              className={`${theme.content_bg} rounded-[4px] px-[40px]`}
                              variant={"primary"}
                           >
                              Login
                           </Button>
                        )}
                     </>
                  )}
               </div>
            </div>
         )}
         {/* admin song */}
         <div className="pb-[30px]">
            <h3 className="text-[24px] font-bold mb-[10px]">Popular</h3>
            {useSongLoading && SongItemSkeleton}

            {!useSongLoading && <>{!!adminSongs.length ? renderAdminSongs : "No songs jet..."}</>}
         </div>
      </>
   );
}
