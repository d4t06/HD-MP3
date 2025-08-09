import { useEffect, useMemo, useRef, useState } from "react";
import { PlaylistModalVariantProps } from "..";
import { initPlaylistObject } from "@/utils/factory";

export default function useAddPlaylistForm(props: PlaylistModalVariantProps) {
  const [playlistData, setPlaylistData] = useState<PlaylistSchema>();
  const [imageFile, setImageFile] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const updatePlaylistData = (data?: Partial<PlaylistSchema>) => {
    if (!playlistData) return;
    setPlaylistData({ ...playlistData, ...data });
  };

  const isChanged = useMemo(() => {
    if (props.variant === "add") return true;
    if (!props.playlist || !playlistData) return false;

    return (
      playlistData.name !== props.playlist.name ||
      playlistData.like !== props.playlist.like ||
      playlistData.is_public !== props.playlist.is_public
    );
  }, [playlistData]);

  const isChangeImage = !!imageFile;

  const isValidToSubmit = useMemo(() => {
    const isValidPlaylistData = !!playlistData?.name && isChanged;

    return props.variant === "add"
      ? isValidPlaylistData
      : isValidPlaylistData || isChangeImage;
  }, [isChangeImage, isChanged, playlistData]);

  const initPlaylistData = () => {
    switch (props.variant) {
      case "add":
        return initPlaylistObject({
          distributor: props.user.display_name,
          owner_email: props.user.email,
          name: props.name,
        });
      case "edit":
        // keep created_at, update updated_at field
        const { id, updated_at, ...rest } = props.playlist;
        return initPlaylistObject(rest);
    }
  };

  useEffect(() => {
    if (props.variant === "add") {
      inputRef.current?.focus();
      props.modalRef.current?.setModalPersist(true);
    }

    setPlaylistData(initPlaylistData());
  }, []);

  useEffect(() => {
    if (isChanged || isChangeImage)
      props.modalRef.current?.setModalPersist(true);
  }, [playlistData, imageFile]);

  useEffect(() => {
    if (!imageFile) return;

    updatePlaylistData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  return {
    playlistData,
    imageFile,
    setImageFile,
    updatePlaylistData,
    setPlaylistData,
    inputRef,
    isValidToSubmit,
    isChanged,
    isChangeImage,
  };
}
