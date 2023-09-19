import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   ChevronRightIcon,
   ClipboardDocumentIcon,
   MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { Song } from "../types";

import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";
import { useSongsStore } from "../store/SongsContext";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";

import { auth } from "../config/firebase";
import { routes } from "../routes";

import useSong from "../hooks/useUserSong";

import SongListItem from "../components/ui/SongListItem";
import Button from "../components/ui/Button";
import LinkItem from "../components/ui/LinkItem";

export default function HomePage() {
   const dispatch = useDispatch();
   const [signInWithGoogle] = useSignInWithGoogle(auth);

   const { theme } = useTheme();
   const [loggedInUser] = useAuthState(auth);

   const { song: songInStore } = useSelector(selectAllSongStore);
   const { adminSongs } = useSongsStore();

   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   const handleSetSong = (song: Song, index: number) => {
      if (songInStore.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index, song_in: "admin" }));
   };

   const windowWidth = window.innerWidth;
   const iconClasses = `w-6 h-6 mr-2 inline`;

   const signIn = () => {
      signInWithGoogle();
   };

   return (
      <>
         {/* mobile nav */}
         {windowWidth <= 549 && (
            <div className="pb-[20px]">
               <div className="flex flex-col gap-3 items-start ">
                  <h1 className="text-[24px] font-bold">Library</h1>

                  {loggedInUser ? (
                     <>
                        <LinkItem
                           className="py-[10px] border-b border-[#333]"
                           to={routes.Playlist}
                           icon={
                              <ClipboardDocumentIcon
                                 className={iconClasses + theme.content_text}
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
                                 className={iconClasses + theme.content_text}
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
               </div>
            </div>
         )}
         {/* admin song */}
         <div className="pb-[30px]">
            <h3 className="text-[24px] font-bold mb-[10px]">Popular</h3>
            {!!adminSongs.length ? (
               <>
                  <div className="flex flex-row flex-wrap gap-[4px] min-[550px]:-mx-[10px]">
                     {adminSongs.map((song, index) => {
                        const active =
                           songInStore.id === song.id && songInStore.song_in === "admin";
                        return (
                           <div key={index} className="w-full max-[549px]:w-full">
                              <SongListItem
                                 isCheckedSong={isCheckedSong}
                                 selectedSongList={selectedSongList}
                                 setIsCheckedSong={setIsCheckedSong}
                                 setSelectedSongList={setSelectedSongList}
                                 
                                 theme={theme}
                                 data={song}
                                 active={active}
                                 onClick={() => handleSetSong(song, index)}
                              />
                           </div>
                        );
                     })}
                  </div>
               </>
            ) : (
               "No songs jet..."
            )}
         </div>
      </>
   );
}
