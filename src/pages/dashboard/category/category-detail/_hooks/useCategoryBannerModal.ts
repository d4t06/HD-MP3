import { deleteFile, myUpdateDoc } from "@/services/firebaseService";
import { useMemo, useState } from "react";
import { useToastContext } from "@/stores";
import { useCategoryContext } from "../CategoryContext";
import { optimizeAndGetHashImage } from "@/services/appService";

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

      const { image_url, image_file_id, blurhash_encode } =
        await optimizeAndGetHashImage({ imageFile, height: 400, width: 1600 });

      const data: Partial<Category> = {
        banner_image_url: image_url,
        banner_file_id: image_file_id,
        banner_blurhash_encode: blurhash_encode,
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
