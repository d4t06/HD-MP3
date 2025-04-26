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
import { optimizeAndGetHashImage } from "@/services/appService";

// event listener
// await promise
// object assign
export default function useUploadSongs() {
  // stores
  const { user, setUser } = useAuthContext();
  const { isDev } = useThemeContext();

  const { uploadedSongs, setUploadedSongs, shouldFetchFavoriteSongs } = useSongContext();
  const { setIsUploading, isUploading, setUploadingSongs, resetUploadContext } =
    useUploadContext();

  // state
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // hooks
  const { setErrorToast, setSuccessToast } = useToastContext();

  const finishAndClear = () => {
    const inputEle = inputRef.current as HTMLInputElement;
    if (inputEle) {
      inputEle.value = "";
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

      const fileIndexesNeeded: number[] = [];
      const imageBlobList: Blob[] = [];

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
        const result = await parserSong(songFile);
        if (!result) continue;

        const singerData: Partial<SingerSchema> = {
          name: result.singer,
          created_at: "",
        };

        const songSinger: Singer = {
          ...initSingerObject(singerData),
          id: "",
        };

        const songData: Partial<SongSchema> = {
          name: result.name,
          singers: [songSinger],
          duration: Math.floor(result.duration),
          size: Math.floor(songFile.size / 1024),
        };

        const imageBlob = result.image ? new Blob([result.image]) : null;

        if (imageBlob) {
          imageBlobList.push(imageBlob);
          songData.image_url = URL.createObjectURL(imageBlob);
        }

        // init song data
        const songFileObject: SongSchema = initSongObject({
          ...songData,
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
        fileIndexesNeeded.push(i);
      }
      //end loop create uploading songs

      // check limit
      if (uploadedSongs.length + fileIndexesNeeded.length > 5)
        return setErrorMessage("You have reach the upload limit");

      // case all song are duplicate
      if (!processSongsList.length) return;

      setUploadingSongs(processSongsList);

      // inputs file1 file2 file3 ... file10
      // need   file2 file10
      // process [{}, {}]

      setIsUploading(true);
      //   start loop upload songs
      for (let index = 0; index < fileIndexesNeeded.length; index++) {
        const fileIndex = fileIndexesNeeded[index];
        const blob = imageBlobList[index];

        const targetSongData = { ...processSongsList[index] };

        const { filePath, fileURL } = await uploadFile({
          file: fileLists[fileIndex],
          folder: "/songs/",
          namePrefix: user.email,
          msg: ">>> api: upload song file",
        });

        if (blob) {
          const newSongData = await optimizeAndGetHashImage({
            blob,
          });

          Object.assign(targetSongData, newSongData);
        }

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

      shouldFetchFavoriteSongs.current = true;

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
