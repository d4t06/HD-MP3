import {
   ChangeEvent,
   RefObject,
   useRef,
   useState,
   useCallback,
   Dispatch,
   SetStateAction,
   useEffect,
} from "react";
import { Song } from "../types";
import { generateId, getBlurhashEncode, parserSong } from "../utils/appHelpers";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { nanoid } from "nanoid";
import {
   mySetDoc,
   setUserSongIdsAndCountDoc,
   uploadBlob,
   uploadFile,
} from "../utils/firebaseHelpers";
import { initSongObject } from "../utils/appHelpers";
import { useAuthStore } from "../store/AuthContext";

type Props = {
   audioRef: RefObject<HTMLAudioElement>;
   admin?: boolean;
   songs?: Song[];
   setSongs?: Dispatch<SetStateAction<Song[]>>;
   firstTempSong: RefObject<HTMLDivElement>;
   testImageRef?: RefObject<HTMLImageElement>;
   inputRef: RefObject<HTMLInputElement>;
};

// event listener
// await promise
// object assign
export default function useUploadSongs({
   audioRef,
   admin,
   songs,
   setSongs,
   firstTempSong,
   inputRef,
}: Props) {
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

   const finishAndClear = (sts: typeof status) => {
      const inputEle = inputRef.current as HTMLInputElement;
      inputEle.value = "";
      setStatus(sts);
   };

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

         const start = Date.now();
         // add tempSongs => upload files => add doc
         try {
            // init tempsSongs, push actuallyFileIds
            let i;
            for (i = 0; i <= fileLists.length - 1; i++) {
               const songFile = fileLists[i];
               const songData = await parserSong(songFile);

               console.log("check song data", songData);
               if (!songData) {
                  setErrorToast({ message: "Error when parser song" });
                  return;
               }

               // inti song data
               let songFileObject: Song = {
                  ...data,
                  name: songData.name,
                  singer: songData.singer,
               };

               // if song have stock image
               let imageBlob;
               if (songData.image) {
                  imageBlob = new Blob([songData.image], { type: "application/octet-stream" });

                  const url = URL.createObjectURL(imageBlob);
                  songFileObject.image_url = url;
               }

               // check duplicate file
               const checkDuplicate = () =>
                  targetSongs.some(
                     (song) =>
                        song.singer === songFileObject.singer && song.name === songFileObject.name
                  );

               if (checkDuplicate()) {
                  console.log(">>>duplicate");
                  isDuplicate.current = true;
                  duplicatedFile.current.push(songFileObject);
                  continue;
               }

               songsList.push(songFileObject);

               // add actuallyFileIds, and assign for_song_id, imageBlob to actuallyFile
               actuallyFileIds.current = [...actuallyFileIds.current, i];
               Object.assign(songFile, { for_song_id: songsList.length - 1, imageBlob } as {
                  for_song_id: number;
                  imageBlob: Blob;
               });
            }

            if (userSongs.length + actuallyFileIds.current.length > 20) {
               if (userInfo.role !== "admin") {
                  finishAndClear("finish-error");
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
                  imageBlob: Blob;
               };

               //  upload song file
               const uploadSongFileProcess = uploadFile({
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
               const songNeedToUpdate = { ...songsList[idInSongsList] };

               // have stock image
               if (songNeedToUpdate.image_url) {
                  // const testImageEle = testImageRef.current as HTMLImageElement

                  // get blurhash encode
                  const { encode } = await getBlurhashEncode(newSongFile.imageBlob);
                  if (encode) {
                     songNeedToUpdate.blurhash_encode = encode;
                  }

                  // upload image file
                  const { fileURL, filePath } = await uploadBlob({
                     blob: newSongFile.imageBlob,
                     folder: "/images/",
                     songId,
                  });

                  URL.revokeObjectURL(songNeedToUpdate.image_url);

                  songNeedToUpdate.image_url = fileURL;
                  songNeedToUpdate.image_file_path = filePath;
               }

               const { filePath, fileURL } = await uploadSongFileProcess;

               songsList[idInSongsList] = {
                  ...songNeedToUpdate,
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
            finishAndClear("finish-error");
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
               finishAndClear("finish-error");
               setToasts((t) => [
                  ...t,
                  { id: nanoid(4), title: "warning", desc: "Song duplicate" },
               ]);
            } else {
               finishAndClear("finish");
               // if upload gather than 1 file
               if (songsList.length > 1) {
                  setSuccessToast({ message: `${songsList.length} songs uploaded` });
               }
            }

            const finish = Date.now();
            console.log("finished after", (finish - start) / 1000);
         } catch (error) {
            console.log(error);
            setErrorToast({ message: "Update user data failed" });
            finishAndClear("finish-error");

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
            URL.revokeObjectURL(audioEle.src);
            setToasts((t) => [
               ...t,
               {
                  title: "success",
                  id: nanoid(4),
                  desc: `'${song.name}' uploaded`,
               },
            ]);

            audioEle.removeEventListener("loadedmetadata", upload);
            resolve();
         };

         audioEle.addEventListener("loadedmetadata", upload);
      });
   }, []);

   useEffect(() => {
      if (!tempSongs.length) return;
      const firstTempSongEle = firstTempSong.current as HTMLDivElement;

      if (firstTempSongEle) {
         firstTempSongEle.scrollIntoView({ behavior: "smooth", block: "center" });
      }
   }, [tempSongs]);

   // console.log("addedSongIds ", addedSongIds);

   return { tempSongs, setTempSongs, addedSongIds, status, handleInputChange };
}
