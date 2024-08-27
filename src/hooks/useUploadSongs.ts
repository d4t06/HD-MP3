import { ChangeEvent, RefObject, useRef, useCallback, useEffect } from "react";
import { generateId, getBlurhashEncode, parserSong } from "../utils/appHelpers";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { nanoid } from "nanoid";
import { mySetDoc, uploadBlob, uploadFile } from "../utils/firebaseHelpers";
import { initSongObject } from "../utils/appHelpers";
import { useAuthStore } from "../store/AuthContext";
// import { testSongs } from "./songs";
import { useTheme, useUpload } from "../store";
import { useSelector } from "react-redux";
import { selectCurrentSong } from "@/store/currentSongSlice";
import { addSongToQueue } from "@/store/songQueueSlice";

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
export default function useUploadSongs({
   audioRef,
   admin,
   inputRef,
   testImageRef,
}: Props) {
   // stores
   const { user } = useAuthStore();
   const { isDev } = useTheme();

   const { userSongs, addUserSongs } = useSongsStore();
   const { currentSong } = useSelector(selectCurrentSong);
   const { setTempSongs, tempSongs, clearTempSongs, shiftSong, status } =
      useUpload();

   // state
   const duplicatedFile = useRef<Song[]>([]);
   const actuallyFileIds = useRef<number[]>([]);
   const isDuplicate = useRef(false);

   // hooks
   const { setErrorToast, setSuccessToast, setToasts } = useToast();

   const finishAndClear = (sts: typeof status) => {
      if (!inputRef.current) return;
      const inputEle = inputRef.current as HTMLInputElement;
      if (inputEle) {
         inputEle.value = "";
         inputEle;
         actuallyFileIds.current = [];
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
         // add tempSongs => upload files => add doc
         try {
            // init tempsSongs, push actuallyFileIds
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
                  size: Math.floor(songFile.size / 1024),
               };

               // case song have stock image
               // let imageBlob;
               // if (songData.image) {
               //    imageBlob = new Blob([songData.image], {
               //       type: "application/octet-stream",
               //    });

               //    const url = URL.createObjectURL(imageBlob);
               //    songFileObject.image_url = url;
               // }

               // case song is duplicate
               const duplicated = checkDuplicate(songFileObject);
               if (duplicated) {
                  console.log(">>>duplicate");
                  isDuplicate.current = true;
                  duplicatedFile.current.push(songFileObject);

                  continue;
               }

               processSongsList.push(songFileObject);

               // add actuallyFileIds, and assign for_song_id, imageBlob to actuallyFile
               actuallyFileIds.current = [...actuallyFileIds.current, i];
               Object.assign(songFile, {
                  for_song_id: processSongsList.length - 1,
                  // imageBlob,
               } as {
                  for_song_id: number;
                  // imageBlob: Blob;
               });
            }

            // check limit
            if (userSongs.length + actuallyFileIds.current.length > 5) {
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

            // inti songItem to render to view
            setTempSongs(processSongsList);

            // upload song file, image file and get blurhash encode
            for (let fileIndex of actuallyFileIds.current) {
               let newSongFile = fileLists[fileIndex] as File & {
                  for_song_id: number;
                  imageBlob: Blob;
               };

               // generateSongId
               let songId = generateId(
                  processSongsList[newSongFile.for_song_id].name
               );

               if (admin) {
                  songId += "_admin";
               }

               // upload song list
               const idInProcessSongsList = newSongFile.for_song_id;
               const targetSong = {
                  ...processSongsList[idInProcessSongsList],
               };

               // case song have stock image
               if (targetSong.image_url) {
                  await handleUploadImage(
                     newSongFile.imageBlob,
                     songId,
                     targetSong
                  );
               }

               //  upload song file
               const { filePath, fileURL } = await uploadFile({
                  file: newSongFile,
                  folder: "/songs/",
                  email: user.email,
                  msg: ">>> api: upload song file",
               });

               // update process songs list
               Object.assign(targetSong, {
                  id: songId,
                  song_file_path: filePath,
                  song_url: fileURL,
               });
               // processSongsList[idInProcessSongsList] = {
               //    ...targetSong,
               //    id: songId,
               //    song_file_path: filePath,
               //    song_url: fileURL,
               // };

               //  update audio src
               const audioEle = audioRef.current as HTMLAudioElement;
               audioEle.src = URL.createObjectURL(newSongFile);

               // upload song doc
               await handleUploadSongDoc(targetSong);
            }
         } catch (error) {
            console.log({ message: error });
            finishAndClear("finish-error");
            setErrorToast({});
            return;
         }

         // after upload songs finish
         // upload user data => clear tempSongs => update songsContext
         try {
            // reset fileList
            actuallyFileIds.current = [];

            // case user
            if (!admin) {
               // const actuallySongIds: string[] = processSongsList.map((song) => song.id);
               // const userSongIds: string[] = userSongs.map((song) => song.id);
               // const newUserSongsIds = [...userSongIds, ...actuallySongIds];
               // // update user doc
               // await setUserSongIdsAndCountDoc({
               //    songIds: newUserSongsIds,
               //    user: user,
               // });
            }

            // if (admin) setAdminSongs([...adminSongs, ...processSongsList]);
            // setUserSongs([...userSongs, ...processSongsList]);

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
         } catch (error) {
            // errorLogger(`catch 2 erorr ${error}`);
            console.log({ message: error });
            setErrorToast({});
            finishAndClear("finish-error");

            return;
         }
      },

      [user, userSongs, currentSong.song_in]
   );

   const handleUploadImage = async (
      imageBlob: Blob,
      songId: string,
      targetSong: Song
   ) => {
      return new Promise<void>((rs, rj) => {
         const testImageEle = testImageRef.current as HTMLImageElement;
         const imageURL = URL.createObjectURL(imageBlob);
         // assign image url
         testImageEle.src = imageURL;

         const uploadImage = async () => {
            try {
               URL.revokeObjectURL(imageURL);

               const { encode } = await getBlurhashEncode(imageBlob);
               const { fileURL, filePath } = await uploadBlob({
                  blob: imageBlob,
                  folder: "/images/",
                  songId,
                  msg: `>>> api: upload song's image blob`,
               });

               if (encode) targetSong.blurhash_encode = encode;
               targetSong.image_url = fileURL;
               targetSong.image_file_path = filePath;

               rs();
               // } catch (error) {
               //    errorLogger("upload image error");
               testImageEle.removeEventListener("error", handleError);
               rj();
            } finally {
               testImageEle.removeEventListener("load", uploadImage);
            }
         };

         const handleError = () => {
            // errorLogger("stock image error");
            URL.revokeObjectURL(imageURL);
            targetSong.image_url = "";
            testImageEle.removeEventListener("error", handleError);

            rs();
         };

         testImageEle.addEventListener("load", uploadImage);
         testImageEle.addEventListener("error", handleError);
      });
   };

   // get song duration and upload song doc
   const handleUploadSongDoc = async (song: Song) => {
      return new Promise<void>((resolve, reject) => {
         const audioEle = audioRef.current as HTMLAudioElement;
         const upload = async () => {
            try {
               const duration = Math.ceil(audioEle.duration);
               Object.assign(song, { duration });

               await mySetDoc({
                  collection: "songs",
                  data: song,
                  id: song.id,
                  msg: ">>> api: set song doc",
               });

               addUserSongs([song]);
               shiftSong();

               // update added song
               if (admin || currentSong.song_in === "user") {
                  // setTriggerUpdateActuallySongs(processSongsList[index]);
                  addSongToQueue({ songs: [{ ...song }] });
                  // console.log("trigger update actually songs");
               }

               // when song uploaded
               URL.revokeObjectURL(audioEle.src);

               if (isDev) console.log(song, "uploaded");

               resolve();
            } catch (error) {
               // errorLogger("upload song file error");
               reject();
            } finally {
               audioEle.removeEventListener("loadedmetadata", upload);
            }
         };

         audioEle.addEventListener("loadedmetadata", upload);
      });
   };

   // useEffect(() => {
   //    if (!triggerUpdateActuallySongs) return;

   //    dispatch(addSongToQueue({ songs: [triggerUpdateActuallySongs] }));

   //    console.log("setActuallySongs when upload song");
   // }, [triggerUpdateActuallySongs?.id]);

   useEffect(() => {
      const firstTempSong = document.querySelector(
         ".temp-song"
      ) as HTMLDivElement;
      if (!firstTempSong) return;

      firstTempSong.scrollIntoView({ behavior: "smooth", block: "center" });
   }, [tempSongs]);

   return { handleInputChange };
}
