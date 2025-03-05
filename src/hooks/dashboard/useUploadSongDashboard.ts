import { ChangeEvent, ElementRef, useRef, useState } from "react";
import { myAddDoc, uploadFile } from "@/services/firebaseService";
import { useAuthContext, useToastContext } from "@/stores";
import { parserSong } from "@/utils/parseSong";
import { initSongObject } from "@/utils/factory";

export default function useUploadSongDashboard() {
  // stores
  const { user } = useAuthContext();

  const [isFetching, setIsFetching] = useState(false);

  const inputRef = useRef<ElementRef<"input">>(null);

  // hooks
  const { setErrorToast, setSuccessToast } = useToastContext();

  const clearInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputEle = e.target as HTMLInputElement & { files: FileList };
    const fileLists = inputEle.files;

    // const start = Date.now();

    try {
      if (!fileLists.length || !user) return;
      setIsFetching(true);

      for (const songFile of fileLists) {
        const songData = await parserSong(songFile);

        // console.log("check song data", songData);
        if (!songData) {
          setErrorToast("Error when parser song");
          clearInput();

          return;
        }

        // init song data
        const songSchema = initSongObject({
          name: songData.name,
          singer: songData.singer,
          duration: Math.floor(songData.duration),
          size: Math.floor(songFile.size / 1024),
          owner_email: user.email,
        });

        const { filePath, fileURL } = await uploadFile({
          file: songFile,
          folder: "/songs/",
          msg: ">>> api: upload song file",
          namePrefix: "admin",
        });

        // update target song
        Object.assign(songSchema, {
          song_file_path: filePath,
          song_url: fileURL,
        });

        await myAddDoc({
          collectionName: "Songs",
          data: songSchema,
          msg: ">>> api: set song doc",
        });

        // setSongs((prev) => [...prev, { ...songSchema, queue_id: nanoid(4) }]);
      }

      clearInput();
      setSuccessToast(`${fileLists.length} songs uploaded`);

      // const finish = Date.now();
    } catch (error) {
      console.log({ message: error });
      clearInput();
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { handleInputChange, inputRef, isFetching };
}
