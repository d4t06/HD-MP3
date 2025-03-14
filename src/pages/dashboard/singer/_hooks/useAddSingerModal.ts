import { myAddDoc, myUpdateDoc, uploadBlob } from "@/services/firebaseService";
import { getBlurHashEncode, optimizeImage } from "@/services/imageService";
import { useToastContext } from "@/stores";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { initSingerObject } from "@/utils/factory";
import { useEffect, useMemo, useRef, useState } from "react";

type Add = {
  variant: "add";
};

type Edit = {
  variant: "edit";
};

export type UseAddSingerModalProps = Add | Edit;

export default function useAddSingerModal(props: UseAddSingerModalProps) {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { setSinger, singer } = useSingerContext();

  const [singerData, setSingerData] = useState<SingerSchema>();
  const [imageFile, setImageFile] = useState<File>();

  const [isFetching, setIsFetching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const updateSingerData = (data?: Partial<SingerSchema>) => {
    if (!singerData) return;
    setSingerData({ ...singerData, ...data });
  };

  const isChanged = useMemo(() => {
    if (props.variant === "add") return true;
    if (!singer || !singerData) return false;

    return (
      singerData.name !== singer.name || singerData.description !== singer.description
    );
  }, [singerData]);

  const isChangeImage = !!imageFile;

  const isValidToSubmit = useMemo(() => {
    const isValidPlaylistData = !!singerData?.name && isChanged;

    return props.variant === "add"
      ? isValidPlaylistData
      : isValidPlaylistData || isChangeImage;
  }, [isChangeImage, isChanged, singerData]);

  const handleSubmit = async () => {
    try {
      if (!isValidToSubmit) return;
      if (!singerData) return;

      const newSingerData = { ...singerData };

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

        const imageData: Partial<SongSchema> = {
          image_file_path: filePath,
          image_url: fileURL,
          blurhash_encode: encode,
        };

        Object.assign(newSingerData, imageData);
      }

      switch (props.variant) {
        case "add": {
          await myAddDoc({
            collectionName: "Singers",
            data: newSingerData,
          });

          setSuccessToast();

          break;
        }
        case "edit": {
          if (!singer) return;

          //  update current singer
          if (singer) setSinger({ ...singer, ...newSingerData });

          setImageFile(undefined);

          await myUpdateDoc({
            collectionName: "Songs",
            id: singer.id,
            data: newSingerData,
          });

          setSuccessToast();
        }
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const initPlaylistData = () => {
    switch (props.variant) {
      case "add":
        return initSingerObject({});
      case "edit":
        if (!singer) throw new Error("");
        const { id, ...rest } = singer;
        return initSingerObject(rest);
    }
  };

  useEffect(() => {
    if (props.variant === "add") inputRef.current?.focus();

    setSingerData(initPlaylistData());
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    updateSingerData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return {
    singerData,
    imageFile,
    setImageFile,
    updateSingerData,
    setSingerData,
    inputRef,
    handleSubmit,
    isFetching,
    isValidToSubmit,
  };
}
