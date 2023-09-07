import { FC, useEffect, useState } from "react";
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
import { useUserState } from "../hooks/useUserState";
import { routes } from "../routes";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {}

const SongsPage: FC<Props> = () => {
   const songStore = useSelector(selectAllSongStore);
   const dispatch = useDispatch();

   const [loggedInUser] = useAuthState(auth);
   const { song: songInStore } = songStore;
   const { theme } = useTheme();
   // const {userData} = useUserState()
   const [songs, setSongs] = useState<Song[]>([]);

   const songsColectionRef = collection(db, "songs");
   const userCollectionRef = collection(db, "users");

   const navigate = useNavigate()

   

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   useEffect(() => {
      console.log("useEffect in songs");
      const getSongs = async () => {
         try {
            const userDocRef = doc(userCollectionRef, loggedInUser?.email as string);
            const userSnapShot = await getDoc(userDocRef);
            const userData = userSnapShot.data() as User;
   
            if (userSnapShot.exists()) {
               if (userData?.songs) {
                  const queryGetUserSongs = query(
                     songsColectionRef,
                     where(documentId(), "in", userData.songs)
                  );
                  const songsSnapshot = await getDocs(queryGetUserSongs);
                  const songsList = songsSnapshot.docs?.map((doc) => {
                     const songData = doc.data() as Song
                     return {...songData, id: doc.id}
                  });
                  setSongs(songsList);
               }
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      getSongs();
   }, []);

   if (!loggedInUser) navigate(routes.home)

   return (
      <div className="pb-[30px] ">
         <div className="flex justify-between">
            <h3 className="text-2xl font-bold">All songs</h3>
            <Link className="text-[400] flex" to={routes.upload}>
               <PlusIcon className="h-[20px] mr-[5px]" />
               Upload
            </Link>
         </div>

         <div className="flex flex-row flex-wrap mt-[30px] -mx-[8px]">
            {!!songs.length ?
               songs.map((song, index) => {
                  return (
                     <div key={index} className="w-1/2 px-[8px] max-[549px]:w-full">
                        <SongListItem
                           theme={theme}
                           onClick={() => handleSetSong(song, index)}
                           active={song.song_path === songInStore.song_path}
                           key={index}
                           data={song  as Song & {id: string}}
                        />
                     </div>
                  );
               }) : <h1 className="pl-[8px]">No song jet...</h1>}
         </div>
      </div>
   );
};

export default SongsPage;
