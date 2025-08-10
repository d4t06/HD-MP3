import { optimizeAndGetHashImage } from "@/services/appService";
import { deleteFile, myAddDoc, myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useState } from "react";

type Props = {
  setIsFetching: (v: boolean) => void;
};

export default function useAddCategory(props?: Props) {
  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const _setIsFetching = props?.setIsFetching || setIsFetching;

  type Add = {
    variant: "add";
    category: CategorySchema;
    imageFile?: File;
  };

  type Edit = {
    variant: "edit";
    category: Partial<CategorySchema>;
    id: string;
    imageFile?: File;
  };

  const addCategory = async ({ imageFile, ...props }: Add | Edit) => {
    try {
      _setIsFetching(true);

      if (imageFile) {
        const imageData = await optimizeAndGetHashImage({
          imageFile,
          width: 870,
          height: 490,
        });

        Object.assign(props.category, imageData);

        if (props.category.image_file_id) {
          deleteFile({ fileId: props.category.image_file_id });
        }
      }

      switch (props.variant) {
        case "add":
          const res = await myAddDoc({
            collectionName: "Categories",
            data: props.category,
          });

          const newCategory: Category = { ...props.category, id: res.id };

          return newCategory;

        case "edit":
          await myUpdateDoc({
            collectionName: "Categories",
            data: props.category,
            id: props.id,
          });

          return true;
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { addCategory, isFetching };
}
