import { optimizeAndGetHashImage } from "@/services/appService";
import { myAddDoc, myUpdateDoc } from "@/services/firebaseService";
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

export type UseAddSingerModalProps = (Add | Edit) & { closeModal: () => void };

export default function useAddSingerModal(props: UseAddSingerModalProps) {
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { singer, setSinger, setSingers } = useSingerContext();

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
      if (!isValidToSubmit || !singerData) return;

      setIsFetching(true);

      const newSingerData = { ...singerData };

      if (imageFile) {
        const imageData = await optimizeAndGetHashImage({
          imageFile,
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

          setSuccessToast("Edit singer successful");
        }
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
      props.closeModal();
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
