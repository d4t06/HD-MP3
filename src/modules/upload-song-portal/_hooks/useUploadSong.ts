import { ChangeEvent, useRef, useEffect, useState } from "react";
import {
  useAuthContext,
  useSongContext,
  useThemeContext,
  useToastContext,
  useUploadContext,
} from "@/stores";
import { myAddDoc, myUpdateDoc, uploadFile } from "@/services/firebaseService";
import { parserSong } from "@/utils/parseSong";
import { initSingerObject, initSongObject } from "@/utils/factory";
import { getDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

// event listener
// await promise
// object assign
export default function useUploadSongs() {
  // stores
  const { user, setUser } = useAuthContext();
  const { isDev } = useThemeContext();

  const { uploadedSongs, setUploadedSongs } = useSongContext();
  const { setIsUploading, isUploading, setUploadingSongs, resetUploadContext } =
    useUploadContext();

  // state
  const fileIndexesNeeded = useRef<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) return;

      const fileLists = e.target.files as FileList;
      if (!fileLists.length) return;

      const processSongsList: SongSchema[] = [];
      const newSongIds: string[] = [];

      const start = Date.now();
      const checkDuplicate = (songObject: SongSchema) => {
        return (
          uploadedSongs.some((s) => s.size === songObject.size) ||
          processSongsList.some((s) => s.size === songObject.size)
        );
      };

      // start loop create uploading songs
      for (let i = 0; i <= fileLists.length - 1; i++) {
        const songFile = fileLists[i];
        const songData = await parserSong(songFile);

        if (!songData) continue;

        const songSinger: Singer = {
          ...initSingerObject({
            name: songData.singer,
          }),
          id: "",
        };

        // init song data
        const songFileObject: SongSchema = initSongObject({
          name: songData.name,
          singers: [songSinger],
          duration: Math.floor(songData.duration),
          size: Math.floor(songFile.size / 1024),
          owner_email: user.email,
          distributor: user.display_name,
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
      if (uploadedSongs.length + fileIndexesNeeded.current.length > 5)
        return setErrorMessage("You have reach the upload limit");

      // case all song are duplicate
      if (!processSongsList.length) return;

      setUploadingSongs(processSongsList);

      // inputs file1 file2 file3 ... file10
      // need   file2 file10
      // process [{}, {}]

      setIsUploading(true);
      //   start loop upload songs
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

        const newSongDoc = await getDoc(docRef);

        newSongIds.push(newSongDoc.id);

        const newSong = {
          ...newSongDoc.data(),
          id: docRef.id,
          queue_id: nanoid(4),
        } as Song;

        setUploadedSongs((prev) => [...prev, newSong]);

        setUploadingSongs((prev) => {
          const rest = [...prev];
          rest.shift;

          return rest;
        });
      }
      //  end loop upload song

      const newUserLikedSongIds = [...newSongIds, ...user.liked_song_ids];
      const newUserData: Partial<User> = {
        liked_song_ids: newUserLikedSongIds,
      };

      await myUpdateDoc({ collectionName: "Users", data: newUserData, id: user.email });

      setUser({ ...user, ...newUserData });

      setSuccessToast(`${processSongsList.length} songs uploaded`);

      const finish = Date.now();
      if (isDev) console.log(">>> upload songs finished after", (finish - start) / 1000);
    } catch (error) {
      console.log({ message: error });
      setErrorToast(errorMessage);
    } finally {
      finishAndClear();
    }
  };

  useEffect(() => {
    if (!isUploading) return;

    const firstSong = document.querySelector(".temp-song") as HTMLDivElement;
    if (!firstSong) return;

    firstSong.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isUploading]);

  return { handleInputChange, inputRef };
}
