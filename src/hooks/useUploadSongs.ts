import { auth, db, store } from "../config/firebase";
import { FieldPath, addDoc, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, Dispatch, RefObject, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Song } from "../types";
import { parserImageFile } from "../utils/parserImage";
import { generateSongId } from "../utils/generateSongId";
import useUserSong from "./useUserSong";

type ModalName = "ADD_PLAYLIST" | "OVERLOAD";

// evenlistenner
// await promise
export default function useUploadSongs(
   audioRef: RefObject<HTMLAudioElement>,
) {
   const [status, setStatus] = useState<"uploading" | "finish" | "overload" | "idle">(
      "idle"
   );
   const [tempSongs, setTempSongs] = useState<Song[]>([]);
   const [addedSongs, setAddedSongs] = useState<string[]>([]);

   const actuallyFileIds = useRef<number[]>([]);
   const [loggedInUser] = useAuthState(auth);
   const LIMIT_UPLOAD = 20;
   // const { songs: userSongs } = useUserSong()

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

      setStatus("uploading");
      let songsList: Song[] = [...tempSongs] || [];

      if (songsList.length + fileLists.length > 5) {
         return setStatus("overload");
      }

      // handle file change, add tempSongs and upload song
      try {
         // init tempsSongs, push actuallyFileIds
         let i;
         for (i = 0; i <= fileLists.length - 1; i++) {
            const songFile = fileLists[i];
            const songData = await parserImageFile(songFile);
            if (songData) {
               let songFileObject: Song = {
                  ...data,
                  name: songData.name,
                  singer: songData.singer,
               };

               // if only one file
               if (!songsList.length) {
                  songsList.push(songFileObject);
               } else {
                  // check duplicate file
                  const isDuplicate = tempSongs.some(
                     (song) =>
                        song.singer === songFileObject.singer &&
                        song.name === songFileObject.name
                  );
                  if (isDuplicate) {
                     console.log(">>>duplicate");
                     continue;
                  }

                  songsList.push(songFileObject);
               }

               console.log("i =", i, fileLists[i].name);

               // add actuallyFileIds, and assign for_song_id to actuallyFile
               actuallyFileIds.current = [...actuallyFileIds.current, i];
               Object.assign(songFile, { for_song_id: songsList.length - 1 } as {
                  for_song_id: number;
               });
            }
         }

         // if no has new songItem after change songs file return
         if (!songsList.length) return setStatus("finish");

         // inti songItem to render to view
         setTempSongs(songsList);

         // update tempSongs data after upload each song file

         for (let fileIndex of actuallyFileIds.current) {
            console.log("check fileIndex", fileIndex);
            let newSongFile = fileLists[fileIndex] as File & { for_song_id: number };

            //  upload song file
            // const fileRef = ref(store, `/songs/${songFile.name}`);
            // const fileRes = await uploadBytes(fileRef, songFile);
            // const fileUrl = await getDownloadURL(fileRes.ref);

            // update songItem data
            const songId = generateSongId(songsList[newSongFile.for_song_id]);
            songsList[newSongFile.for_song_id] = {
               ...songsList[newSongFile.for_song_id],
               id: songId,
               // file_name: fileRes.metadata.fullPath,
               // song_path: fileUrl,
            };

            //  update audio src
            const audioEle = audioRef.current as HTMLAudioElement;
            audioEle.src = URL.createObjectURL(newSongFile);

            // upload song doc
            await handleUploadSong(songsList, newSongFile.for_song_id);
         }
      } catch (error) {
         console.log(error);
         setStatus("finish");
      }

      // upload user data
      try {
         console.log("user doc updated");
         actuallyFileIds.current = [];
         // update uploaded songs list of loggedInUser after update list of songs
         // const userDocRef = doc(db, "users", loggedInUser?.email as string);
         // const allUserSongs: string[] = userSongs.map((song) => song.id);

         // const newUserSongs = [...allUserSongs, ...addedSongs]
         // await setDoc(
         //    userDocRef,
         //    {
         //       songs: newUserSongs,
         //       song_count: newUserSongs.length,
         //    },
         //    { merge: true }
         // );
      } catch (error) {
         console.log(error);
      } finally {
         setStatus("finish");
      }
   };

   // get song duration and upload song doc
   const handleUploadSong = (songsList: Song[], index: number) =>
      new Promise<void>((resolve) => {
         const audioEle = audioRef.current as HTMLAudioElement;
         const upload = async () => {
            setTimeout(async () => {
               let song = songsList[index];
               song = {
                  ...song,
                  duration: +audioEle.duration.toFixed(1) || 99,
               };

               // await setDoc(doc(db, 'songs', song.id), song)

               console.log("set added song");
               setTempSongs(songsList);
               setAddedSongs((prev) => [...prev, song.id]);

               console.log("set added song");

               // console.log('song doc added');

               audioEle.removeEventListener("loadedmetadata", upload);
               URL.revokeObjectURL(audioEle.src);

               resolve();
            }, 500);
         };

         audioEle.addEventListener("loadedmetadata", upload);
      });

   // console.log("addedSongs ", addedSongs);

   return { tempSongs, setTempSongs, addedSongs, status, handleInputChange };
}
