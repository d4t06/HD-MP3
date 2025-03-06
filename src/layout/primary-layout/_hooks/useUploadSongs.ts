import { ChangeEvent, useRef, useCallback, useEffect, useState } from "react";
import {
  useAuthContext,
  useSongContext,
  useThemeContext,
  useToastContext,
  useUploadContext,
} from "@/stores";
import { myAddDoc, uploadFile } from "@/services/firebaseService";
import { parserSong } from "@/utils/parseSong";
import { initSongObject } from "@/utils/factory";
import { getDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

// event listener
// await promise
// object assign
export default function useUploadSongs() {
  // stores
  const { user } = useAuthContext();
  const { isDev } = useThemeContext();

  const { songs, setSongs } = useSongContext();
  const { setIsUploading, isUploading, setUploadingSongs, resetUploadContext } =
    useUploadContext();

  // state
  const fileIndexesNeeded = useRef<number[]>([]);
  const [errorMessage, setErrorMessgae] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // hooks
  const { setErrorToast, setSuccessToast } = useToastContext();

  const finishAndClear = () => {
    const inputEle = inputRef.current as HTMLInputElement;
    if (inputEle) {
      inputEle.value = "";
      fileIndexesNeeded.current = [];
    }

    resetUploadContext();
  };

  // closure
  // const logger = (type: "error" | "success") => {
  //    const log = (msg: string) => console.log(`[${type}]: ${msg}`);
  //    return log;
  // };
  // const errorLogger = logger("error");

  const handleInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!user) return;

      const inputEle = e.target as HTMLInputElement & { files: FileList };
      const fileLists = inputEle.files;

      if (!fileLists.length) return;

      let processSongsList: SongSchema[] = [];

      const start = Date.now();
      const checkDuplicate = (songObject: SongSchema) => {
        return (
          songs.some(
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
        // start lop create uploading songs
        for (let i = 0; i <= fileLists.length - 1; i++) {
          const songFile = fileLists[i];
          const songData = await parserSong(songFile);

          if (!songData) continue;

          // init song data
          const songFileObject: SongSchema = initSongObject({
            name: songData.name,
            singer: songData.singer,
            duration: Math.floor(songData.duration),
            size: Math.floor(songFile.size / 1024),
            owner_email: user.email,
          });

          // case song is duplicate
          const duplicated = checkDuplicate(songFileObject);
          if (duplicated) {
            console.log(">>>duplicate");
            continue;
          }

          processSongsList.push(songFileObject);
          fileIndexesNeeded.current = [...fileIndexesNeeded.current, i];
        }

        //end loop create uploading songs

        // check limit
        if (songs.length + fileIndexesNeeded.current.length > 5)
          return setErrorMessgae("You have reach the upload limit");

        // case all song are duplicate
        if (!processSongsList.length) return setErrorMessgae("Duplicated song");

        setUploadingSongs(processSongsList);

        // inputs file1 file2 file3 ... file10
        // need   file2 file10
        // process [{}, {}]

        //   start loop upload songs

        setIsUploading(true);

        for (let index = 0; index < fileIndexesNeeded.current.length; index++) {
          const fileIndex = fileIndexesNeeded.current[index];

          const targetSongData = { ...processSongsList[index] };

          const { filePath, fileURL } = await uploadFile({
            file: fileLists[fileIndex],
            folder: "/songs/",
            namePrefix: user.email,
            msg: ">>> api: upload song file",
          });

          Object.assign(targetSongData, {
            song_file_path: filePath,
            song_url: fileURL,
          });

          const docRef = await myAddDoc({
            collectionName: "Songs",
            data: targetSongData,
            msg: ">>> api: set song doc",
          });

          const newSongRef = await getDoc(docRef);

          const newSong = {
            ...newSongRef.data(),
            id: docRef.id,
            queue_id: nanoid(4),
          } as Song;

          setSongs((prev) => [...prev, newSong]);

          setUploadingSongs((prev) => {
            const rest = [...prev];
            rest.shift;

            return rest;
          });
        }

        //  end loop upload song

        setSuccessToast(`${processSongsList.length} songs uploaded`);

        const finish = Date.now();
        if (isDev)
          console.log(">>> upload songs finished after", (finish - start) / 1000);
      } catch (error) {
        console.log({ message: error });
        setErrorToast(errorMessage);
      } finally {
        finishAndClear();
      }
    },
    [user, songs]
  );

  useEffect(() => {
    if (!isUploading) return;

    const firstSong = document.querySelector(".temp-song") as HTMLDivElement;
    if (!firstSong) return;

    firstSong.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isUploading]);

  return { handleInputChange, inputRef };
}
