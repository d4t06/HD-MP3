import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import { Song, User } from "../types";
import { useSongs } from "../store/SongsContext";

export default function useUserSong() {
   const userCollectionRef = collection(db, "users");
   const songsCollectionRef = collection(db, "songs");

   const [loggedInUser] = useAuthState(auth);

   const { songs, setSongs } = useSongs();

   const [userPlaylistIds, setUserPlaylistIds] = useState<string[]>([]);

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
                  where("by", "==", loggedInUser?.email)
               );

               // get songs uploaded by user
               const songsSnapshot = await getDocs(queryGetUserSongs);
               const songsList = songsSnapshot.docs?.map((doc) => {
                  const songData = doc.data() as Song;
                  return { ...songData, id: doc.id };
               });

               setSongs(songsList);
               setUserPlaylistIds(userData.playlist);
            }
         }
      } catch (error) {
         console.log({ message: error });
      }
   };

   useEffect(() => {
      if (!songs.length) {
         getSongs();
      }
   }, []);

   return { songs, userPlaylistIds, setUserPlaylistIds };
}
