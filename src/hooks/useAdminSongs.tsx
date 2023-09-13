import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Song } from "../types";
import { useEffect, useState } from "react";

export default function useAdminSong() {
   const [adminSongs, setAdminSongs] = useState<Song[]>([])


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
               setAdminSongs(songsList);
            }
         }
      } catch (error) {
         console.log({ message: error });
      }
   };


   useEffect(() => {
      if (!adminSongs.length) {
         getSongs()
      }
   }, [])


   return {adminSongs};
}