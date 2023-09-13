
import { auth, db, store } from "../config/firebase";
import {
   doc,
   setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, RefObject, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Song } from "../types";
import { parserImageFile } from "../utils/parserImage";
import { generateSongId } from "../utils/generateSongId";
import useUserSong from "./useUserSong";


export default function useUploadSongs(audioRef: RefObject<HTMLAudioElement>) {

   const [isUpload, setIsUpload] = useState(false);
   const [tempSongs, setTempSongs] = useState<Song[]>([]);
   const [addedSongs, setAddedSongs] = useState<string[]>([]);

   const [loggedInUser] = useAuthState(auth)
   const { songs: userSongs } = useUserSong()

   const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement & { files: FileList };
      const fileLists = target.files;
      let data: Song = {
         id: "",
         name: "",
         singer: "",
         image_path: "",
         file_name: "",
         song_path: "",
         by: loggedInUser?.email as string,
         duration: 0,
         lyric_id: "",
      };

      setIsUpload(true);
      let songsList: Song[] = [];

      // init songsList
      for (let songFile of fileLists) {
         const songData = await parserImageFile(songFile);
         if (songData) {
            let songItem: Song = {
               ...data,
               name: songData.name,
               singer: songData.singer,
            };
            songsList.push(songItem);
         }
      }

      // init songsList
      setTempSongs(prev => [...prev, songsList] as Song[]);

      try {
         // update songsList after upload each song file
         let i;
         for (i = 0; i <= fileLists.length - 1; i++) {
            const songFile: File = fileLists[i];

            //  upload song file
            const fileRef = ref(store, `/songs/${songFile.name}`);
            const fileRes = await uploadBytes(fileRef, songFile);
            const fileUrl = await getDownloadURL(fileRes.ref);

            console.log("song file uploaded");

            const songId = generateSongId(songsList[i]);
            songsList[i] = {
               ...songsList[i],
               id: songId,
               file_name: fileRes.metadata.fullPath,
               song_path: fileUrl,
            };

            //  update audio element src
            const audioEle = audioRef.current as HTMLAudioElement;
            audioEle.src = URL.createObjectURL(songFile);

            // upload song doc
            await handleUploadSong(songsList, i);
         }

         // update uploaded songs list of loggedInUser after update list of songs
         const userDocRef = doc(db, "users", loggedInUser?.email as string);
         const allUserSongs: string[] = userSongs.map((song) => song.id);
         await setDoc(
            userDocRef,
            {
               songs: [...allUserSongs, ...addedSongs],
            },
            { merge: true }
         );

         setIsUpload(false);
      } catch (error) {
         console.log(error);
      }
   };

   const handleUploadSong = async (songsList: Song[], index: number) => {
      let song = songsList[index];

      const audioEle = audioRef.current as HTMLAudioElement;

      const upload = async () => {
         song = {
            ...song,
            duration: +audioEle.duration.toFixed(1) || 99,
         };

         console.log("song doc = ", song);
         try {
            await setDoc(doc(db, "songs", song.id), song);

            // update temp songs
            if (tempSongs.length) {
               let newTempSongs = tempSongs // old and new song
               const actuallyIndexOfNewSong = index + (newTempSongs.length - songsList.length)
               newTempSongs[actuallyIndexOfNewSong] = song;
               setTempSongs(newTempSongs);

            } else {
               songsList[index] = song;
               setTempSongs(songsList)
            }

            // update in process songs list
            setAddedSongs((prev) => [...prev, song.id]);

            console.log("song doc added");
         } catch (error) {
            console.log({ message: error });
         } finally {
            audioEle.removeEventListener("loadedmetadata", upload);
            URL.revokeObjectURL(audioEle.src);
         }
      };

      audioEle.addEventListener("loadedmetadata", upload);
   };


   return { tempSongs, addedSongs, isUpload, handleInputChange }

}