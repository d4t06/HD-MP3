import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import AddAlbumModal from "..";
import { useAddAlbumContext } from "../AddAlbumContext";
import { initAlbumObject } from "@/utils/factory";
import { myAddDoc, myUpdateDoc } from "@/services/firebaseService";
import { getDoc, serverTimestamp } from "firebase/firestore";
import { optimizeAndGetHashImage } from "@/services/appService";
import { useToastContext } from "@/stores";
import { convertToEn } from "@/utils/appHelpers";

export default function useAddAlbumModal(
  props: ComponentProps<typeof AddAlbumModal>,
) {
  const {
    imageFile,
    updateAlbumData,
    setSinger,
    albumData,
    // setSongs,
    // album,
    singer,
    // songs,
    // setAlbum,
    setImageFile,
    setAlbumData,
  } = useAddAlbumContext();

  const { setSuccessToast, setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const ranEffect = useRef(false);

  const isChanged = useMemo(() => {
    if (props.variant === "add") return true;
    if (!props.album || !albumData) return false;

    return (
      albumData.name !== props.album.name ||
      singer?.id !== props.album.singers[0].id ||
      albumData.like !== props.album.like
    );
  }, [albumData, singer]);

  const isChangeImage = !!imageFile;

  const isValidToSubmit = useMemo(() => {
    const isValid: boolean =
      !!isChanged && !!albumData && !!albumData.name && !!singer;

    return props.variant === "add" ? isValid : isValid || isChangeImage;
  }, [isChangeImage, isChanged, albumData, singer]);

  const submit = async () => {
    try {
      if (!albumData || !singer) return;
      setIsFetching(true);

      if (imageFile) {
        const imageData = await optimizeAndGetHashImage({ imageFile });
        Object.assign(albumData, imageData);
      }

      albumData.singers = [singer];
      albumData.singer_map = { [singer.id]: true };

      albumData.name = albumData.name.trim();
      albumData.meta = convertToEn(albumData.name).split(" ");

      switch (props.variant) {
        case "add": {
          const docRef = await myAddDoc({
            collectionName: "Playlists",
            data: albumData,
          });

          const newDocRef = await getDoc(docRef);

          const newAlbum: Playlist = {
            ...(newDocRef.data() as PlaylistSchema),
            id: newDocRef.id,
          };

          props.afterSubmit(newAlbum);
          setSuccessToast(`Album created`);

          break;
        }
        case "edit": {
          if (!props.album) return;

          await myUpdateDoc({
            collectionName: "Playlists",
            data: { ...albumData, updated_at: serverTimestamp() },
            id: props.album.id,
          });

          props.afterSubmit(albumData);
          setSuccessToast(`Album edited`);

          break;
        }
      }

      props.modalRef.current?.close();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
      setImageFile(undefined);
    }
  };

  const initAlbumData = async () => {
    switch (props.variant) {
      case "add":
        setAlbumData(
          initAlbumObject({
            owner_email: props.user.email,
            distributor: props.user.email,
          }),
        );

        setSinger(props.singer);

        break;

      case "edit":
        const { id, ...rest } = props.album;

        setSinger(rest.singers[0]);

        setAlbumData(rest);
        break;
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      initAlbumData();

      if (props.variant === "add")
        props.modalRef.current?.setModalPersist(true);
    }
  }, []);

  useEffect(() => {
    if (isChanged || imageFile) props.modalRef.current?.setModalPersist(true);
  }, [albumData, singer, imageFile]);

  useEffect(() => {
    if (!imageFile) return;

    updateAlbumData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  return { submit, isFetching, isValidToSubmit };
}
