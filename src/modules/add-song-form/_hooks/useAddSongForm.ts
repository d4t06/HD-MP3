import { ModalRef } from "@/components";
import { myAddDoc, uploadFile } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { parserSong } from "@/utils/parseSong";
import { useEffect, useRef, useState } from "react";

export default function useAddSongForm() {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const {
    songFile,
    updateSongData,
    resetAddSongContext,
    songData,
    singers,
    genres,
    ...rest
  } = useAddSongContext();

  const [isFetching, setIsFetching] = useState(false);

  const modalRef = useRef<ModalRef>(null);

  const handleCloseModalAfterFinished = () => {
    setTimeout(() => resetAddSongContext(), 500);
    () => modalRef.current?.close();
  };

  const handleParseSongFile = async () => {
    if (!songFile) return;

    const payload = await parserSong(songFile);
    if (payload) {
      updateSongData({
        name: payload.name,
        duration: Math.floor(payload.duration),
        size: Math.floor(songFile.size / 1024),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!songData || !songFile) return;

      setIsFetching(true);

      const { filePath, fileURL } = await uploadFile({
        file: songFile,
        folder: "/songs/",
        msg: ">>> api: upload song file",
        namePrefix: "admin",
      });

      Object.assign(songData, {
        singers,
        genre_ids: genres.map((g) => g.id),
        song_url: fileURL,
        song_file_path: filePath,
      } as Partial<SongSchema>);

      await myAddDoc({
        collectionName: "Songs",
        data: songData,
        msg: ">>> api: set song doc",
      });

      setSuccessToast();

      modalRef.current?.open();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    console.log(songFile);
    if (!songFile) return;

    handleParseSongFile();
  }, [songFile]);

  return {
    handleSubmit,
    isFetching,
    updateSongData,
    songFile,
    songData,
    genres,
    singers,
    modalRef,
    handleCloseModalAfterFinished,
    ...rest,
  };
}
