import { ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from "react";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { Song, User } from "../types";
import { useTheme } from "../store/ThemeContext";
import {
   collection,
   doc,
   documentId,
   getDoc,
   getDocs,
   query,
   where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { routes } from "../routes";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from "../components/ui/Button";
import { useSongs } from "../store/SongsContext";

interface Props {}

const SongsPage: FC<Props> = () => {
   const songStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const [loggedInUser] = useAuthState(auth);
   const { theme } = useTheme();

   const { song: songInStore } = songStore;
   const { songs, setSongs } = useSongs();
   const [userSongs, setUserSongs] = useState<Song[]>([]);
   const [tab, setTab] = useState("all");

  //  const [tempSongs, setTempSongs] = useState<Song & {status: string}[] >()

   const songsCollectionRef = collection(db, "songs");
   const userCollectionRef = collection(db, "users");

   const navigate = useNavigate();

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   const allSong = [...userSongs, ...songs];

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {files : FileList}

    console.log('check file', target.files)
   };

   // get usersongs
   useEffect(() => {
      //  console.log("useEffect in songs");
      const getSongs = async () => {
         try {
            const userDocRef = doc(userCollectionRef, loggedInUser?.email as string);

            // get user data
            const userSnapShot = await getDoc(userDocRef);
            const userData = userSnapShot.data() as User;

            if (userSnapShot.exists()) {
               if (userData?.songs.length) {
                  // get with condition, use query
                  const queryGetUserSongs = query(
                     songsCollectionRef,
                     where(documentId(), "in", userData.songs)
                  );

                  // get songs uploaded by user
                  const songsSnapshot = await getDocs(queryGetUserSongs);
                  const songsList = songsSnapshot.docs?.map((doc) => {
                     const songData = doc.data() as Song;
                     return { ...songData, id: doc.id };
                  });
                  setUserSongs(songsList);
               }
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      getSongs();
   }, []);

   // get admin songs
   useEffect(() => {
      const getSongs = async () => {
         try {
            const queryGetAdminSongs = query(
               collection(db, "songs"),
               where("by", "==", "admin")
            );
            const songsSnap = await getDocs(queryGetAdminSongs);

            if (songsSnap) {
               const songsList = songsSnap.docs?.map((doc) => {
                  const songsData = doc.data() as Song;

                  return { ...songsData, id: doc.id };
               });

               if (songsList) {
                  setSongs(songsList);
               }
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      if (!songs.length) {
         getSongs();
      }
   }, []);

   if (!loggedInUser) navigate(routes.home);

   console.log("check user song", songs);

   return (
      <div className="pb-[30px] ">
         <div className="flex justify-between">
            <h3 className="text-2xl font-bold">All songs</h3>
            <input
               onChange={handleInputChange}
               type="file"
               multiple
               accept=".mp3"
               id="file"
               className="hidden"
            />
            <label
               className={`${theme.content_bg} rounded-full flex px-[20px] py-[4px] cursor-pointer`}
               htmlFor="file"
            >
               <PlusCircleIcon className="w-[20px] mr-[5px]" />
               Upload
            </label>
         </div>

         <div className="flex mt-[10px] gap-[10px]">
            <Button
               onClick={() => setTab("all")}
               variant={"primary"}
               className={`rounded-full ${
                  tab === "all" ? theme.content_bg : "bg-" + theme.alpha
               }`}
            >
               All
            </Button>
            <Button
               onClick={() => setTab("uploaded")}
               variant={"primary"}
               className={`rounded-full ${
                  tab === "uploaded" ? theme.content_bg : "bg-" + theme.alpha
               }`}
            >
               Uploaded
            </Button>
         </div>
         <div className="flex flex-row flex-wrap gap-[10px] mt-[30px] -mx-[8px]">
            {tab === "uploaded" && (
               <>
                  {!!userSongs.length ? (
                     <>
                        {userSongs.map((song, index) => {
                           return (
                              <div
                                 key={index}
                                 className="w-full px-[8px] max-[549px]:w-full"
                              >
                                 <SongListItem
                                    theme={theme}
                                    onClick={() => handleSetSong(song, index)}
                                    active={song.song_path === songInStore.song_path}
                                    key={index}
                                    data={song as Song & { id: string }}
                                 />
                              </div>
                           );
                        })}
                     </>
                  ) : (
                     <h1 className="pl-[8px]">No song jet...</h1>
                  )}
               </>
            )}

            {tab === "all" && (
               <>
                  {!!allSong.length ? (
                     <>
                        {allSong.map((song, index) => {
                           return (
                              <div
                                 key={index}
                                 className="w-full px-[8px] max-[549px]:w-full"
                              >
                                 <SongListItem
                                    theme={theme}
                                    onClick={() => handleSetSong(song, index)}
                                    active={song.song_path === songInStore.song_path}
                                    key={index}
                                    data={song as Song & { id: string }}
                                 />
                              </div>
                           );
                        })}
                     </>
                  ) : (
                     <h1 className="pl-[8px]">No song jet...</h1>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default SongsPage;
