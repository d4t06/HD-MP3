import {
   ChevronRightIcon,
   ClipboardDocumentIcon,
   MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { Song } from "../types";

import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useTheme } from "../store/ThemeContext";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";

import { auth } from "../config/firebase";

import { routes } from "../routes";

import SongListItem from "../components/ui/SongListItem";
import Button from "../components/ui/Button";
import LinkItem from "../components/ui/LinkItem";
import useAdminSong from "../hooks/useAdminSongs";

export default function HomePage() {
   const dispatch = useDispatch();
   const [signInWithGoogle] = useSignInWithGoogle(auth);
   
   const { theme } = useTheme();
   const [loggedInUser] = useAuthState(auth);

   const {adminSongs} = useAdminSong()
   const songStore = useSelector(selectAllSongStore);

   const handleSetSong = (song: Song, index: number) => {
      if (songStore.song.id === song.id) return;
      dispatch(setSong({ ...song, currentIndex: index }));
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
                           to={routes.playlist}
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
                           to={routes.allSong}
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
                        return (
                           <div
                              key={index}
                              className="w-full max-[549px]:w-full"
                           >
                              <SongListItem
                                 theme={theme}
                                 data={song}
                                 active={songStore.song.id === song.id}
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
