import {
  deleteFile,
  myUpdateDoc,
  uploadFile,
} from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { useState } from "react";

type Props = {
  closeModal: () => void;
};

export default function useChangeSongFile({ closeModal }: Props) {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { song, updateSongData } = useAddSongContext();

  const [songFile, setSongFile] = useState<File>();
  const [isFetching, setIsFetching] = useState(false);

  const submit = async () => {
    try {
      if (!songFile || !song) return;

      setIsFetching(true);

      deleteFile({ fileId: song.song_file_id });

      const { url, fileId } = await uploadFile({
        file: songFile,
        folder: "/songs/",
      });

      const newSongData = {
        song_url: url,
        song_file_path: fileId,
      } as Partial<SongSchema>;

      await myUpdateDoc({
        collectionName: "Songs",
        data: newSongData,
        id: song.id,
      });

      updateSongData(newSongData);

      setSuccessToast(`Change song file successful`);

      closeModal();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { songFile, isFetching, submit, setSongFile };
}
