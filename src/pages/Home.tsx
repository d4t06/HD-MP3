import {
   ChevronRightIcon,
   ClipboardDocumentIcon,
   HeartIcon,
   MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import {  useEffect } from "react";
// import { songs } from "../utils/songs";
import SongItem from "../components/ui/SongItem";
import { useDispatch, useSelector } from "react-redux";
import { Song } from "../types";

import { selectAllSongStore, setSong } from "../store/SongSlice";
import { routes } from "../routes";
import { useTheme } from "../store/ThemeContext";
import LinkItem from "../components/ui/LinkItem";
import SongListItem from "../components/ui/SongListItem";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useSongs } from "../store/SongsContext";
import { useAuthState } from "react-firebase-hooks/auth";

export default function HomePage() {
   const dispatch = useDispatch();
   const songStore = useSelector(selectAllSongStore);

   const [loggedInUser, _loading, _error] = useAuthState(auth);

   const { song: songInStore } = songStore;
   const { theme } = useTheme();

   const { songs, setSongs } = useSongs();
   const songsColectionRef = collection(db, "songs");
   const queryGetAdminSongs = query(songsColectionRef, where("by", "==", 'admin'));

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   const windowWidth = window.innerWidth;
   const iconClasses = `w-6 h-6 mr-2 inline`;

   // console.log("loggedInUser", loggedInUser)

   useEffect(() => {
      const getSongs = async () => {
         try {
            const songsSnap = await getDocs(queryGetAdminSongs);

            if (songsSnap) {
               const songsList = songsSnap.docs?.map(doc => {
                  const songsData = doc.data() as Song;

                  return {...songsData, id : doc.id}
               });
               
               if (songsList) {
                  setSongs(songsList);
// console.log("check song list", songsList);
            
               }
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      getSongs();
   }, []);

   console.log("check songs", songs);
   


   return (
      <>
         {/* mobile nav */}
         {windowWidth <= 549 && (
            <div className="pb-[20px]">
               <div className="flex flex-col gap-3 items-start ">
                  <h1 className="text-2xl font-bold">Library</h1>

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
                     to={routes.favorite}
                     icon={
                        <HeartIcon
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
               </div>
            </div>
         )}
         <div className="pb-[30px]">
            <h3 className="text-xl font-bold mb-[10px]">Popular</h3>

            {!!songs.length ? (
               <>
                  <div className="flex flex-row flex-wrap gap-y-5 -mx-4">
                     {songs.map((song, index) => {
                        // if (index > 3) return;
                        
                        return (
                           <div
                              key={index}
                              className="w-full px-[10px] max-[549px]:w-full"
                           >
                              <SongListItem
                                 theme={theme}
                                 data={song  as Song & {id: string}}
                                 active={
                                    song.song_path === songInStore.song_path
                                 }
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

         {/* {windowWidth >= 550 && (
            <div className="pb-[30px]">
               <h3 className="text-xl font-bold mb-[10px]">All songs</h3>

               {!!songs[0].name ? (
                  <>
                     <div className="flex flex-row flex-wrap gap-y-5 -mx-4">
                        {!!songs[0].name &&
                           songs.map((song, index) => {
                              return (
                                 <div
                                    key={index}
                                    className="w-1/2 px-[10px] max-[549px]:w-full"
                                 >
                                    <SongListItem
                                       theme={theme}
                                       onClick={() =>
                                          handleSetSong(song, index)
                                       }
                                       active={
                                          song.image_path ===
                                          songInStore.image_path
                                       }
                                       key={index}
                                       data={song}
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
         )} */}
      </>
   );
}
