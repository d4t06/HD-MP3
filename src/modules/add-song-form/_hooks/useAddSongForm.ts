import { ModalRef } from "@/components";
import {
  deleteFile,
  myAddDoc,
  myGetDoc,
  myUpdateDoc,
  uploadFile,
} from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { parserSong } from "@/utils/parseSong";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import AddSongForm from "..";
import { initSongObject } from "@/utils/factory";
import { optimizeAndGetHashImage } from "@/services/appService";
import { convertToEn } from "@/utils/appHelpers";
import { writeBatch } from "firebase/firestore";
import { db } from "@/firebase";

export default function useAddSongForm(
  props: ComponentProps<typeof AddSongForm>,
) {
  const { resetPage } = useSongContext();
  const { setErrorToast, setSuccessToast } = useToastContext();
  const {
    songFile,
    imageFile,
    setImageFile,
    updateSongData,
    setSongData,
    // resetAddSongContext,
    songData,
    singers,
    song,
    genres,
    setGenres,
    setSingers,
    imageBlob,
    setImageBlob,
    audioRef,
    setSongFile,
    playlists,
    imageUrl,
    setImageUrl,
    setSong,
  } = useAddSongContext();

  const [isFetching, setIsFetching] = useState(false);

  const modalRef = useRef<ModalRef>(null);

  const isChanged = useMemo(() => {
    if (props.variant === "add") return true;
    if (!song || !songData) return false;

    const firstCheck =
      songData.name !== song.name ||
      singers.length !== song.singers.length ||
      singers.length !== song.singers.length ||
      songData.like !== song.like ||
      genres.length !== song.genres.length ||
      songData.release_year !== song.release_year ||
      songData.blurhash_encode !== song.blurhash_encode ||
      songData.main_genre?.id !== song.main_genre?.id;

    if (firstCheck) return true;

    const songSingerIds = song.singers.map((s) => s.id);
    const songGenreIds = song.genres.map((s) => s.id);

    const isChangeSinger = singers.find((s) => !songSingerIds.includes(s.id));
    const isChangeGenre = genres.find((g) => !songGenreIds.includes(g.id));

    return !!isChangeSinger || !!isChangeGenre;
  }, [songData, song, singers, genres]);

  const isValidToSubmit = useMemo(() => {
    const isValidSongData =
      !!songData?.name &&
      !!singers.length &&
      !!genres.length &&
      !!songData.release_year &&
      !!songData.main_genre &&
      isChanged;

    return props.variant === "add"
      ? isValidSongData
      : isValidSongData && (isChanged || !!imageFile || !!imageUrl);
  }, [imageFile, imageUrl, isChanged, singers, genres, songData]);

  console.log(isChanged);

  const initSongData = () => {
    switch (props.variant) {
      case "add":
        return initSongObject({
          owner_email: props.ownerEmail,
          distributor: props.distributor,
          is_official: true,
        });
      case "edit":
        if (audioRef.current) audioRef.current.src = props.song.song_url;

        // keep created_at, update updated_at field
        const { id, updated_at, ...rest } = props.song;

        setSingers(rest.singers);
        setGenres(rest.genres);
        // setMainGenre(main_genre);

        return initSongObject(rest);
    }
  };

  const handleCloseModalAfterFinished = () => {
    switch (props.variant) {
      case "add":
        modalRef.current?.close();
        setTimeout(() => {
          setSongFile(undefined);
          setImageFile(undefined);
          setImageBlob(undefined);
          setImageUrl("");

          setSingers([]);
          setGenres([]);
          setSongData(initSongData());
        }, 500);
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
        name: payload.name + " " + payload.singer,
        duration: Math.floor(payload.duration),
        size: Math.floor(songFile.size / 1024),
        image_url: "",
      };

      if (payload.image) {
        const blob = new Blob([payload.image]);

        setImageBlob(blob);
        data.image_url = URL.createObjectURL(blob);
      }

      updateSongData(data);
    }
  };

  const getSongMeta = () => {
    if (!songData) return [];
    const meta: string[] = [];

    convertToEn;

    meta.push(...convertToEn(songData.name).split(" "));
    singers.forEach((s) => meta.push(...convertToEn(s.name).split(" ")));

    return meta;
  };

  const getSongGenreAndSinger = () => {
    const singer_map: Song["singer_map"] = {};

    singers.forEach((s) => (singer_map[s.id] = true));
    const genre_ids = genres.map((g) => g.id);

    return { singer_map, genre_ids };
  };

  const handleSubmit = async () => {
    try {
      if (!isValidToSubmit || !songData || !audioRef.current) return;

      audioRef.current.pause();

      const newSongData = { ...songData };

      setIsFetching(true);

      let uploadImageProcess:
        | ReturnType<typeof optimizeAndGetHashImage>
        | undefined = undefined;

      if (imageFile || imageBlob || imageUrl) {
        if (song?.image_file_id)
          deleteFile({
            fileId: song.image_file_id,
            msg: ">>> api: Delete image file",
          });

        uploadImageProcess = optimizeAndGetHashImage({
          imageFile,
          blob: imageBlob,
          fromUrl: imageBlob ? "" : imageUrl,
        });
      }

      switch (props.variant) {
        case "add": {
          if (!songFile) return;

          const uploadSongPrcess = uploadFile({
            file: songFile,
            folder: "/songs/",
            msg: "upload song file",
          });

          const [resImageData, { fileId, url }] = await Promise.all([
            uploadImageProcess,
            uploadSongPrcess,
          ]);

          const data: Partial<SongSchema> = {
            singers,
            genres,
            song_url: url,
            song_file_id: fileId,
            first_letter: convertToEn(newSongData.name.charAt(0)),
            ...getSongGenreAndSinger(),
            meta: getSongMeta(),
          };

          Object.assign(newSongData, data);

          if (resImageData) {
            const songImageData: Partial<SongSchema> = {
              image_url: resImageData.image_url,
              image_file_id: resImageData.image_file_id,
              blurhash_encode: resImageData.blurhash_encode,
            };

            Object.assign(newSongData, songImageData);
          }

          const docRef = await myAddDoc({
            collectionName: "Songs",
            data: newSongData,
            msg: ">>> api: set song doc",
          });

          if (playlists.length) {
            const batch = writeBatch(db);

            const addSongToPlaylist = async (id: string) => {
              const playlistDoc = await myGetDoc({
                collectionName: "Playlists",
                id,
              });

              if (!playlistDoc.exists()) return;

              const newPlaylistData: Partial<Playlist> = {
                song_ids: [
                  ...(playlistDoc.data() as PlaylistSchema).song_ids,
                  docRef.id,
                ],
              };

              batch.update(playlistDoc.ref, newPlaylistData);
            };

            await Promise.all(playlists.map((p) => addSongToPlaylist(p.id)));

            batch.commit();
          }

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
              first_letter: convertToEn(newSongData.name.charAt(0)),
              ...getSongGenreAndSinger(),
              meta: getSongMeta(),
            };

            Object.assign(newSongData, data);
          }

          if (uploadImageProcess) {
            const { blurhash_encode, image_file_id, image_url } =
              await uploadImageProcess;

            const songImageData: Partial<SongSchema> = {
              image_url,
              image_file_id,
              blurhash_encode,
            };

            Object.assign(newSongData, songImageData);
          }

          setImageFile(undefined);
          setImageBlob(undefined);
          setImageUrl("");

          await myUpdateDoc({
            collectionName: "Songs",
            id: song.id,
            data: newSongData,
          });

          updateSongData(newSongData);
          setSong({ ...song, ...newSongData });

          setSuccessToast("Song updated");
        }
      }

      resetPage();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setSongData(initSongData());
  }, []);

  // update audio src when change song file
  useEffect(() => {
    if (!songFile || !audioRef.current) return;

    audioRef.current.src = URL.createObjectURL(songFile);

    handleParseSongFile();
  }, [songFile]);

  // update audio src when change song file
  useEffect(() => {
    if (!songData || !audioRef.current) return;

    audioRef.current.src = songData.song_url;
  }, [songData?.song_url]);

  // update song data when chane image file
  useEffect(() => {
    if (!imageFile) return;

    updateSongData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  // update song data when choose external image
  useEffect(() => {
    if (!imageUrl) return;

    updateSongData({ image_url: imageUrl });
  }, [imageUrl]);

  //  warn user when reload page without save change
  useEffect(() => {
    if (!isChanged) return;
    const handleBeforeRefresh = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeRefresh);
    };
  }, [isChanged]);

  return {
    isValidToSubmit,
    handleSubmit,
    isFetching,
    updateSongData,
    handleCloseModalAfterFinished,
    modalRef,
    isChanged,
  };
}
