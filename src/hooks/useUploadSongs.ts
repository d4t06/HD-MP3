import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
   ChangeEvent,
   RefObject,
   useRef,
   useState,
   MutableRefObject,
   useCallback,
   Dispatch,
   SetStateAction,
   useMemo,
} from "react";
import { Song } from "../types";
import { parserImageFile } from "../utils/parserImage";
import { generateId } from "../utils/appHelpers";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { nanoid } from "nanoid";
import { mySetDoc, setUserSongIdsAndCountDoc, uploadFile } from "../utils/firebaseHelpers";
import { initSongObject } from "../utils/appHelpers";
import { useAuthStore } from "../store/AuthContext";

type ModalName = "ADD_PLAYLIST" | "MESSAGE";
type Props = {
   audioRef: RefObject<HTMLAudioElement>;
   message: MutableRefObject<string>;
   handleOpenModal?: (name: ModalName) => void;
   admin?: boolean;
   songs?: Song[];
   setSongs?: Dispatch<SetStateAction<Song[]>>;
};

// event listener
// await promise
// object assign
export default function useUploadSongs({ audioRef, admin, songs, setSongs }: Props) {
   // use stores
   const { userInfo } = useAuthStore();
   const { setErrorToast, setSuccessToast, setToasts } = useToast();
   const { setUserSongs, userSongs } = useSongsStore();

   // hook states
   const [status, setStatus] = useState<"uploading" | "finish" | "idle" | "finish-error">("idle");
   const [tempSongs, setTempSongs] = useState<Song[]>([]);
   const [addedSongIds, setAddedSongIds] = useState<string[]>([]);

   const duplicatedFile = useRef<Song[]>([]);
   const actuallyFileIds = useRef<number[]>([]);
   const isDuplicate = useRef(false);

   const handleInputChange = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
         if (!userInfo.email) {
            setErrorToast({ message: "Missing user data" });
            return;
         }

         setStatus("uploading");
         const target = e.target as HTMLInputElement & { files: FileList };
         const fileLists = target.files;

         if (!fileLists.length) {
            setStatus("finish");
            return;
         }

         // init song object
         let data = initSongObject({
            by: admin ? "admin" : (userInfo.email as string),
         });

         let songsList: Song[] = [];
         let targetSongs: Song[] = [];

         if (admin && songs) targetSongs = songs;
         else targetSongs = userSongs;

         // add tempSongs => upload files => add doc
         try {
            // init tempsSongs, push actuallyFileIds
            let i;
            for (i = 0; i <= fileLists.length - 1; i++) {
               const songFile = fileLists[i];
               const songData = await parserImageFile(songFile);

               // console.log("check song data", songData);

               if (songData) {
                  // inti song data
                  let songFileObject: Song = {
                     ...data,
                     name: songData.name,
                     singer: songData.singer,
                  };

                  // check duplicate file
                  const checkDuplicate = () =>
                     targetSongs.some(
                        (song) =>
                           song.singer === songFileObject.singer &&
                           song.name === songFileObject.name
                     );

                  if (checkDuplicate()) {
                     console.log(">>>duplicate");
                     isDuplicate.current = true;
                     duplicatedFile.current.push(songFileObject);
                     continue;
                  }

                  songsList.push(songFileObject);

                  // add actuallyFileIds, and assign for_song_id to actuallyFile
                  actuallyFileIds.current = [...actuallyFileIds.current, i];
                  Object.assign(songFile, { for_song_id: songsList.length - 1 } as {
                     for_song_id: number;
                  });
               }
            }

            if (userSongs.length + actuallyFileIds.current.length > 20) {
               if (userInfo.role !== "admin") {
                  setStatus("finish-error");
                  setErrorToast({ message: "You have reach the upload limit" });
                  return;
               }
            }

            // forget case song upload by user can't parse
            // if no has new songItem after change songs file =>  open modal, return
            if (!songsList.length) {
               setStatus("finish-error");
               setErrorToast({ message: "Duplicate song" });
               return;
            }

            // inti songItem to render to view
            setTempSongs(songsList);

            // upload song file
            for (let fileIndex of actuallyFileIds.current) {
               let newSongFile = fileLists[fileIndex] as File & {
                  for_song_id: number;
               };

               //  upload song file
               const { fileURL, filePath } = await uploadFile({
                  file: newSongFile,
                  folder: "/songs/",
                  email: userInfo.email,
               });

               // generateSongId
               let songId = generateId(songsList[newSongFile.for_song_id].name);

               if (admin) {
                  songId += "_admin";
               } else {
                  songId += "_" + userInfo.email.replace("@gmail.com", "");
               }

               // upload song list
               const idInSongsList = newSongFile.for_song_id;
               songsList[idInSongsList] = {
                  ...songsList[idInSongsList],
                  id: songId,
                  song_file_path: filePath,
                  song_url: fileURL,
               };

               //  update audio src
               const audioEle = audioRef.current as HTMLAudioElement;
               audioEle.src = URL.createObjectURL(newSongFile);

               // upload song doc
               await handleUploadSong(songsList, idInSongsList);
            }
         } catch (error) {
            console.log(error);
            setStatus("finish-error");
            setErrorToast({ message: "error when upload song file" });

            setTempSongs([]);
            return;
         }

         // after upload songs finish
         // upload user data => clear tempSongs => update songsContext
         try {
            // reset fileList
            actuallyFileIds.current = [];

            // case user
            if (!admin) {
               const actuallySongsListIds: string[] = songsList.map((song) => song.id);
               const userSongIds: string[] = userSongs.map((song) => song.id);
               const newUserSongsIds = [...userSongIds, ...actuallySongsListIds];

               // update user doc
               await setUserSongIdsAndCountDoc({
                  songIds: newUserSongsIds,
                  userInfo: userInfo,
               });

               // update songs to context store
               setUserSongs([...userSongs, ...songsList]);
            }

            setTempSongs([]);

            if (setSongs) {
               setSongs([...targetSongs, ...songsList]);
            }
            // case admin
            if (isDuplicate.current) {
               setStatus("finish-error");
               setToasts((t) => [
                  ...t,
                  { id: nanoid(4), title: "warning", desc: "Song duplicate" },
               ]);
            } else {
               setStatus("finish");

               // if upload gather than 1 file
               if (songsList.length > 1) {
                  setSuccessToast({ message: `${songsList.length} songs uploaded` });
               }
            }
         } catch (error) {
            console.log(error);
            setErrorToast({ message: "Update user data failed" });
            setStatus("finish-error");

            return;
         }
      },

      [userInfo, userSongs, songs]
   );

   // get song duration and upload song doc
   const handleUploadSong = useCallback(async (songsList: Song[], index: number) => {
      return new Promise<void>((resolve) => {
         const audioEle = audioRef.current as HTMLAudioElement;
         const upload = async () => {
            let song = songsList[index];
            // update songList
            const duration = +audioEle.duration.toFixed(1) || 99;
            song = {
               ...song,
               duration,
            };
            songsList[index] = song;

            // add to firebase
            await mySetDoc({ collection: "songs", data: song, id: song.id });

            // update new song list (include new song_url....)
            setTempSongs(songsList);

            // update added song
            setAddedSongIds((prev) => [...prev, song.id]);

            // when song uploaded
            audioEle.removeEventListener("loadedmetadata", upload);
            URL.revokeObjectURL(audioEle.src);
            setToasts((t) => [
               ...t,
               {
                  title: "success",
                  id: nanoid(4),
                  desc: `'${song.name}' uploaded`,
               },
            ]);

            resolve();
         };

         audioEle.addEventListener("loadedmetadata", upload);
      });
   }, []);

   // console.log("addedSongIds ", addedSongIds);

   return { tempSongs, setTempSongs, addedSongIds, status, handleInputChange };
}
