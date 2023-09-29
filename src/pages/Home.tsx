import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   ChevronRightIcon,
   ClipboardDocumentIcon,
   MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { Playlist, Song } from "../types";

import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";
import { useSongsStore } from "../store/SongsContext";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";

import { auth } from "../config/firebase";
import { routes } from "../routes";

import useSong from "../hooks/useSongs";

import SongListItem from "../components/ui/SongItem";
import Button from "../components/ui/Button";
import LinkItem from "../components/ui/LinkItem";
import Skeleton from "../components/skeleton";
import MobileSongItem from "../components/ui/MobileSongItem";
import useSongItemActions from "../hooks/useSongItemActions";

// song item actions
// import { addSongToPlaylist } from "../utils/SongItemActions";

export default function HomePage() {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const [signInWithGoogle] = useSignInWithGoogle(auth);
   const [loggedInUser, userLoading] = useAuthState(auth);
   const { loading: useSongLoading } = useSong();
   const { adminSongs, userPlaylists } = useSongsStore();

   const { song: songInStore } = useSelector(selectAllSongStore);

   // use hooks
   const { updatePlaylistAfterChange } = useSongItemActions();

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

   const handleAddSongToPlaylist = (song: Song, playlist: Playlist) => {
      if (!song || !playlist) return;

      const newSongIds = [...playlist.song_ids, song.id];
      const time = playlist.time + song.duration;

      const newPlaylist: Playlist = {
         ...playlist,
         time,
         song_ids: newSongIds,
         count: newSongIds.length,
      };
      updatePlaylistAfterChange({ newPlaylist });
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
               <SongListItem
                  theme={theme}
                  onClick={() => handleSetSong(song, index)}
                  active={active}
                  key={index}
                  data={song}
                  isCheckedSong={isCheckedSong}
                  userPlaylists={userPlaylists}
                  selectedSongList={selectedSongList}
                  setIsCheckedSong={setIsCheckedSong}
                  setSelectedSongList={setSelectedSongList}
                  addSongToPlaylist={handleAddSongToPlaylist}
               />
            </div>
         );
      });
   }, []);

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
                  {userLoading ? (
                     menuItemSkeletons
                  ) : (
                     <>
                        {loggedInUser ? (
                           <>
                              <LinkItem
                                 className="py-[10px] border-b border-[#333]"
                                 to={routes.Playlist}
                                 icon={
                                    <ClipboardDocumentIcon
                                       className={classes.icon + theme.content_text}
                                    />
                                 }
                                 label="Playlist"
                                 arrowIcon={
                                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                                 }
                              />
                              <LinkItem
                                 className="py-[10px] border-b border-[#333]"
                                 to={routes.MySongs}
                                 icon={
                                    <MusicalNoteIcon
                                       className={classes.icon + theme.content_text}
                                    />
                                 }
                                 label="All songs"
                                 arrowIcon={
                                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                                 }
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

            {!useSongLoading && (
               <>{!!adminSongs.length ? renderAdminSongs : "No songs jet..."}</>
            )}
         </div>
      </>
   );
}
