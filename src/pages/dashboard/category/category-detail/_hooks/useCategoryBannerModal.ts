import {
  deleteFile,
  myUpdateDoc,
  uploadFile,
} from "@/services/firebaseService";
import { useMemo, useState } from "react";
import { useToastContext } from "@/stores";
import { useCategoryContext } from "../CategoryContext";

export default function useCategoryBannerModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { category, setCategory } = useCategoryContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [imageFile, setImageFile] = useState<File>();
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!imageFile || !category) throw new Error();

      setIsFetching(true);

      const { fileId, url } = await uploadFile({
        file: imageFile,
        folder: "/songs/",
      });

      const data: Partial<Category> = {
        banner_image_url: url,
        banner_file_id: fileId,
      };

      await myUpdateDoc({
        collectionName: "Categories",
        id: category.id,
        data: data,
      });

      if (category.banner_file_id)
        deleteFile({
          fileId: category.banner_file_id,
        });

      setCategory(() => ({ ...category, ...data }));

      setSuccessToast("Update banner successful");
      closeModal();
    } catch (error) {
      console.log({ error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const imageUrl = useMemo(
    () =>
      (imageFile && URL.createObjectURL(imageFile)) ||
      category?.banner_image_url ||
      "",
    [imageFile],
  );

  return {
    category,
    imageUrl,
    imageFile,
    setImageFile,
    isFetching,
    handleSubmit,
  };
}
