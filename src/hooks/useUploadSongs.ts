import { ChangeEvent, RefObject, useRef, useCallback, useEffect } from "react";
import { generateId, parserSong } from "../utils/appHelpers";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { nanoid } from "nanoid";
import { mySetDoc, uploadFile } from "../utils/firebaseHelpers";
import { initSongObject } from "../utils/appHelpers";
import { useAuthStore } from "../store/AuthContext";
import { useTheme, useUpload } from "../store";
import { useSelector } from "react-redux";
import { selectCurrentSong } from "@/store/currentSongSlice";

type Props = {
   audioRef: RefObject<HTMLAudioElement>;
   admin?: boolean;
   firstTempSong?: RefObject<HTMLDivElement>;
   testImageRef: RefObject<HTMLImageElement>;
   inputRef: RefObject<HTMLInputElement>;
};

// event listener
// await promise
// object assign
export default function useUploadSongs({ admin, inputRef }: Props) {
   // stores
   const { user } = useAuthStore();
   const { isDev } = useTheme();

   const { userSongs, addUserSongs } = useSongsStore();
   const { currentSong } = useSelector(selectCurrentSong);
   const { setTempSongs, tempSongs, clearTempSongs, shiftSong, status } =
      useUpload();

   // state
   const duplicatedFile = useRef<Song[]>([]);
   const fileIndexesNeeded = useRef<number[]>([]);
   const isDuplicate = useRef(false);

   // hooks
   const { setErrorToast, setSuccessToast, setToasts } = useToast();

   const finishAndClear = (sts: typeof status) => {
      if (!inputRef.current) return;
      const inputEle = inputRef.current as HTMLInputElement;
      if (inputEle) {
         inputEle.value = "";
         inputEle;
         fileIndexesNeeded.current = [];
      }

      clearTempSongs(sts);
   };

   // closure
   // const logger = (type: "error" | "success") => {
   //    const log = (msg: string) => console.log(`[${type}]: ${msg}`);
   //    return log;
   // };
   // const errorLogger = logger("error");

   const handleInputChange = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
         if (!user) return setErrorToast({ message: "Missing user data" });

         clearTempSongs("uploading");

         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         if (!fileLists.length) {
            clearTempSongs("finish");
            return;
         }

         // init song object
         let data = initSongObject({
            by: admin ? "admin" : (user.email as string),
            song_in: admin ? "admin" : "user",
         });

         let processSongsList: Song[] = [];

         const start = Date.now();
         const checkDuplicate = (songObject: Song) => {
            return (
               userSongs.some(
                  (s) =>
                     s.singer === songObject.singer &&
                     s.name === songObject.name &&
                     s.size === songObject.size
               ) ||
               processSongsList.some(
                  (s) =>
                     s.singer === songObject.singer &&
                     s.name === songObject.name &&
                     s.size === songObject.size
               )
            );
         };
         try {
            let i;
            for (i = 0; i <= fileLists.length - 1; i++) {
               const songFile = fileLists[i];
               const songData = await parserSong(songFile);

               // console.log("check song data", songData);
               if (!songData) {
                  setErrorToast({ message: "Error when parser song" });
                  finishAndClear("finish-error");

                  return;
               }

               // init song data
               let songFileObject: Song = {
                  ...data,
                  name: songData.name,
                  singer: songData.singer,
                  duration: Math.floor(songData.duration),
                  size: Math.floor(songFile.size / 1024),
               };

               // case song is duplicate
               const duplicated = checkDuplicate(songFileObject);
               if (duplicated) {
                  console.log(">>>duplicate");
                  isDuplicate.current = true;
                  duplicatedFile.current.push(songFileObject);

                  continue;
               }

               processSongsList.push(songFileObject);
               fileIndexesNeeded.current = [...fileIndexesNeeded.current, i];
            }

            // check limit
            if (userSongs.length + fileIndexesNeeded.current.length > 5) {
               if (user.role !== "ADMIN") {
                  finishAndClear("finish-error");
                  setErrorToast({ message: "You have reach the upload limit" });
                  return;
               }
            }

            // case all song are duplicate
            if (!processSongsList.length) {
               isDuplicate.current = false;
               finishAndClear("finish-error");
               setErrorToast({ message: "Duplicate song" });
               return;
            }

            setTempSongs(processSongsList);

            // inputs file1 file2 file3 ... file10
            // need   file2 file10
            // process [{}, {}]

            for (
               let index = 0;
               index < fileIndexesNeeded.current.length;
               index++
            ) {
               const fileIndex = fileIndexesNeeded.current[index];

               let songId = generateId(processSongsList[index].name);
               if (admin) songId += "_admin";

               const targetSong = { ...processSongsList[index] };

               const { filePath, fileURL } = await uploadFile({
                  file: fileLists[fileIndex],
                  folder: "/songs/",
                  email: user.email,
                  msg: ">>> api: upload song file",
               });

               // update target song
               Object.assign(targetSong, {
                  id: songId,
                  song_file_path: filePath,
                  song_url: fileURL,
               });

               await mySetDoc({
                  collection: "songs",
                  data: targetSong,
                  id: targetSong.id,
                  msg: ">>> api: set song doc",
               });

               addUserSongs([targetSong]);

               shiftSong();

               // no handle song queue here
               if (isDev) console.log(targetSong.name, "uploaded");
            }

            fileIndexesNeeded.current = [];

            if (isDuplicate.current) {
               finishAndClear("finish-error");
               setToasts((t) => [
                  ...t,
                  { id: nanoid(4), title: "warning", desc: "Song duplicate" },
               ]);
            } else {
               finishAndClear("finish");
               setSuccessToast({
                  message: `${processSongsList.length} songs uploaded`,
               });
            }

            const finish = Date.now();
            if (isDev)
               console.log(
                  ">>> upload songs finished after",
                  (finish - start) / 1000
               );

            return;
         } catch (error) {
            console.log({ message: error });
            finishAndClear("finish-error");
            setErrorToast({});
            return;
         }
      },

      [user, userSongs, currentSong.song_in]
   );

   useEffect(() => {
      const firstTempSong = document.querySelector(
         ".temp-song"
      ) as HTMLDivElement;
      if (!firstTempSong) return;

      firstTempSong.scrollIntoView({ behavior: "smooth", block: "center" });
   }, [tempSongs]);

   return { handleInputChange };
}
