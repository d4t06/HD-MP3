import { ModalRef } from "@/components";
import {
  deleteFile,
  myAddDoc,
  myUpdateDoc,
  uploadBlob,
  uploadFile,
} from "@/services/firebaseService";
import { getBlurHashEncode, optimizeImage } from "@/services/imageService";
import { useToastContext } from "@/stores";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { parserSong } from "@/utils/parseSong";
import { useEffect, useMemo, useRef, useState } from "react";

export default function useAddSongForm() {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const {
    songFile,
    imageFile,
    setSong,
    setImageFile,
    updateSongData,
    resetAddSongContext,
    songData,
    singers,
    variant,
    song,
    genres,
    imageBLob,
    serImageBlob,
    ...rest
  } = useAddSongContext();

  const [isFetching, setIsFetching] = useState(false);

  const modalRef = useRef<ModalRef>(null);

  const isChanged = useMemo(() => {
    if (variant.current === "add") return true;
    if (!song || !songData) return false;

    return (
      songData.name !== song.name ||
      singers.length !== song.singers.length ||
      genres.length !== song.genres.length
    );
  }, [songData, song, singers, genres]);

  const isChangeImage = !!imageFile;

  const isValidToSubmit = useMemo(() => {
    const isValidSongData =
      !!songData?.name && !!singers.length && !!genres.length && isChanged;

    return variant.current === "add" ? isValidSongData : isValidSongData || isChangeImage;
  }, [isChangeImage, isChanged, singers, genres, songData]);

  const handleCloseModalAfterFinished = () => {
    switch (variant.current) {
      case "add":
        setTimeout(() => resetAddSongContext(), 500);
        () => modalRef.current?.close();
        break;
      case "edit":
        modalRef.current?.close();
    }
  };

  const handleParseSongFile = async () => {
    if (!songFile) return;

    const payload = await parserSong(songFile);
    if (payload) {
      const data: Partial<SongSchema> = {
        name: payload.name,
        duration: Math.floor(payload.duration),
        size: Math.floor(songFile.size / 1024),
        image_url: "",
      };

      if (payload.image) {
        const blob = new Blob([payload.image]);

        serImageBlob(blob);
        data.image_url = URL.createObjectURL(blob);
      }

      updateSongData(data);
    }
  };

  const getSongMap = () => {
    const genre_map: Song["genre_map"] = {};
    const singer_map: Song["singer_map"] = {};

    genres.forEach((g) => (genre_map[g.id] = true));
    singers.forEach((s) => (singer_map[s.id] = true));

    return { genre_map, singer_map };
  };

  const handleSubmit = async () => {
    try {
      if (!isValidToSubmit || !songData) return;

      const newSongData = { ...songData };

      setIsFetching(true);

      if (imageFile) {
        const imageBlob = await optimizeImage(imageFile);
        if (imageBlob == undefined) return;

        const uploadProcess = uploadBlob({
          blob: imageBlob,
          folder: "/images/",
        });

        const { encode } = await getBlurHashEncode(imageBlob);
        const { filePath, fileURL } = await uploadProcess;

        if (variant.current === "edit" && song?.image_file_path)
          deleteFile({
            filePath: song.image_file_path,
            msg: ">>> api: Delete image file",
          });

        const imageData: Partial<SongSchema> = {
          image_file_path: filePath,
          image_url: fileURL,
          blurhash_encode: encode,
        };
        Object.assign(newSongData, imageData);
      }

      switch (variant.current) {
        case "add": {
          if (!songFile) return;

          const { filePath, fileURL } = await uploadFile({
            file: songFile,
            folder: "/songs/",
            msg: ">>> api: upload song file",
            namePrefix: "song",
          });

          const data: Partial<SongSchema> = {
            singers,
            genres,
            song_url: fileURL,
            song_file_path: filePath,
            ...getSongMap(),
          };

          Object.assign(newSongData, data);

          await myAddDoc({
            collectionName: "Songs",
            data: newSongData,
            msg: ">>> api: set song doc",
          });

          setSuccessToast();
          modalRef.current?.open();

          break;
        }
        case "edit": {
          if (!song) return;

          if (isChanged) {
            const data: Partial<SongSchema> = {
              singers,
              genres,
              ...getSongMap(),
            };

            Object.assign(newSongData, data);
          }

          // reset
          if (song) setSong({ ...song, ...newSongData });
          setImageFile(undefined);

          await myUpdateDoc({
            collectionName: "Songs",
            id: song.id,
            data: newSongData,
          });

          setSuccessToast();
          modalRef.current?.open();
        }
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!songFile) return;

    handleParseSongFile();
  }, [songFile]);

  useEffect(() => {
    if (!imageFile) return;

    updateSongData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  return {
    isValidToSubmit,
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
