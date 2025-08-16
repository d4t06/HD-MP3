import { useEffect, useMemo, useRef, useState } from "react";
import { initCategory } from "@/utils/factory";
import { AddCategoryModalProps } from "../_components/AddCategoryModal";

export default function useAddCategoryModal(props: AddCategoryModalProps) {
  const [categoryData, setCategoryData] = useState<CategorySchema>();
  const [imageFile, setImageFile] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const updateData = (data?: Partial<CategorySchema>) => {
    if (!categoryData) return;
    setCategoryData({ ...categoryData, ...data });
  };

  const isChanged = useMemo(() => {
    if (props.variant === "add") return true;
    if (!props.category || !categoryData) return false;

    return categoryData.name !== props.category.name;
  }, [categoryData]);

  const isChangeImage = !!imageFile;

  const isValidToSubmit = useMemo(() => {
    const isValidPlaylistData = !!categoryData?.name && isChanged;

    return props.variant === "add"
      ? isValidPlaylistData
      : isValidPlaylistData || isChangeImage;
  }, [isChangeImage, isChanged, categoryData]);

  const initPlaylistData = () => {
    switch (props.variant) {
      case "add":
        return initCategory({});
      case "edit":
        // keep created_at, update updated_at field
        const { id, updated_at, ...rest } = props.category;
        return initCategory(rest);
    }
  };

  useEffect(() => {
    if (props.variant === "add") inputRef.current?.focus();

    setCategoryData(initPlaylistData());
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    updateData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  useEffect(() => {
    if (isChanged) props?.modalRef?.current?.setModalPersist(true);
    else props?.modalRef?.current?.setModalPersist(false);
  }, [isChanged]);

  return {
    categoryData,
    imageFile,
    setImageFile,
    updateData,
    setCategoryData,
    inputRef,
    isValidToSubmit,
    isChanged,
    isChangeImage,
  };
}
