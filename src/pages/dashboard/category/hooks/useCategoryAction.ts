import { myAddDoc, myDeleteDoc, myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { useState } from "react";

export default function useCategoryLobbyAction() {
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type Add = {
    type: "add-category";
    category: CategorySchema;
  };

  type Edit = {
    type: "edit";
    category: Partial<CategorySchema>;
    id: string;
  };

  type Delete = {
    type: "delete";
    id: string;
  };

  const action = async (props: Add | Edit | Delete) => {
    try {
      setIsFetching(true);
      switch (props.type) {
        case "add-category": {
          const docRef = await myAddDoc({
            collectionName: "Categories",
            data: props.category,
          });

          const newCategory: Category = {
            ...props.category,
            id: docRef.id,
          };

          // setGenres((prev) => [newCategory, ...prev]);
          setIsFetching(false);

          setSuccessToast("Add genre successful");

          return newCategory;
        }

        case "edit": {
          await myUpdateDoc({
            collectionName: "Categories",
            data: props.category,
            id: props.id,
          });

          // const newGenres = [...genres];

          // const index = newGenres.findIndex((g) => g.id === props.id);

          // const target = { ...genres[index] };
          // Object.assign(target, props.genre);
          // newGenres[index] = target;

          // setGenres(newGenres);
          setSuccessToast("Edit category successful");

          break;
        }

        case "delete": {
          await myDeleteDoc({
            collectionName: "Categories",
            id: props.id,
          });

          // setGenres((prev) => prev.filter((g) => g.id !== props.id));

          setSuccessToast("Delete category successful");

          break;
        }
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action };
}
