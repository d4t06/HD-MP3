import { ModalRef } from "@/components";
import { optimizeAndGetHashImage } from "@/services/appService";
import { deleteFile, myAddDoc, myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { convertToEn } from "@/utils/appHelpers";
import { initSingerObject } from "@/utils/factory";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

type Add = {
  variant: "add";
  afterSubmit?: (singer: Singer) => void;
  name?: string;
};

type Edit = {
  variant: "edit";
};

export type UseAddSingerModalProps = (Add | Edit) & {
  modalRef: RefObject<ModalRef>;
};

export default function useAddSingerModal(props: UseAddSingerModalProps) {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { singer, setSinger, setSingers, shouldGetSingers, lastDoc } =
    useSingerContext();

  const [singerData, setSingerData] = useState<SingerSchema>();
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();

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
      singerData.name !== singer.name ||
      singerData.description !== singer.description ||
      singerData.like !== singer.like
    );
  }, [singerData]);

  const isChangeImage = !!imageFile || !!imageUrl;

  const isValidToSubmit = useMemo(() => {
    const isValidPlaylistData = !!singerData?.name && isChanged;

    return props.variant === "add"
      ? isValidPlaylistData
      : isValidPlaylistData || isChangeImage;
  }, [isChangeImage, isChanged, singerData]);

  const handleSubmit = async () => {
    try {
      if (!isValidToSubmit || !singerData) return;

      setIsFetching(true);

      const newSingerData: SingerSchema = {
        ...singerData,
        name: singerData.name.trim(),
        meta: convertToEn(singerData.name.trim()).split(" "),
      };

      if (isChangeImage) {
        if (singerData.image_file_id)
          deleteFile({ fileId: singerData.image_file_id });

        const imageData = await optimizeAndGetHashImage({
          imageFile,
          fromUrl: imageUrl,
        });

        Object.assign(newSingerData, imageData);
      }

      switch (props.variant) {
        case "add": {
          const docRef = await myAddDoc({
            collectionName: "Singers",
            data: newSingerData,
          });

          const newSinger = { ...singerData, id: docRef.id };

          setSingers((prev) => [newSinger, ...prev]);

          if (props.afterSubmit) {
            Object.assign(newSinger, { created_at: "" } as Partial<Singer>);
            props.afterSubmit(newSinger);
          }

          setSuccessToast("Add singer successful");

          break;
        }
        case "edit": {
          if (!singer) return;

          await myUpdateDoc({
            collectionName: "Singers",
            id: singer.id,
            data: newSingerData,
          });

          setSinger({ ...singer, ...newSingerData });

          shouldGetSingers.current = true;
          lastDoc.current = undefined;

          setSuccessToast("Edit singer successful");
        }
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
      props.modalRef.current?.close();
    }
  };

  const initPlaylistData = () => {
    switch (props.variant) {
      case "add":
        return initSingerObject({ name: props.name });
      case "edit":
        if (!singer) throw new Error("");
        const { id, ...rest } = singer;
        return initSingerObject(rest);
    }
  };

  useEffect(() => {
    if (props.variant === "add") {
      inputRef.current?.focus();
      props.modalRef.current?.setModalPersist(true);
    }

    setSingerData(initPlaylistData());
  }, []);

  useEffect(() => {
    if (props.variant === "edit")
      if (isChanged || isChangeImage) {
        props.modalRef.current?.setModalPersist(true);
      }
  }, [isChanged, isChangeImage]);

  useEffect(() => {
    if (!imageFile) return;

    updateSingerData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  useEffect(() => {
    if (!imageUrl) return;

    updateSingerData({ image_url: imageUrl });
  }, [imageUrl]);

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
    setImageUrl
  };
}
