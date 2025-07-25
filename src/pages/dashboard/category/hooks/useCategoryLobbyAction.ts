import { myAddDoc, myDeleteDoc, myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { RefObject, useState } from "react";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";
import { ModalRef } from "@/components";

type Props = {
  modalRef: RefObject<ModalRef>
}

export default function useCategoryLobbyAction(mainProps?:Props) {
  const { page, setPage, categories, setCategories } =
    useCategoryLobbyContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type Add = {
    type: "add-section";
    section: CategoryLobbySection;
    variant: "category" | "playlist";
  };

  type AddCategory = {
    type: "add-category";
    category: CategorySchema;
    sectionIndex: number;
  };

  type Edit = {
    type: "edit-section";
    variant: "category" | "playlist";
    section: Partial<CategoryLobbySection>;
    index: number;
  };

  type Delete = {
    type: "delete";
    variant: "category" | "playlist";
    index: number;
  };

  const action = async (props: Add | Edit | Delete | AddCategory) => {
    try {
      if (!page) return;

      setIsFetching(true);
      switch (props.type) {
        case "add-section": {
          const newPage = { ...page };

          switch (props.variant) {
            case "category":
              newPage.category_sections.push(props.section);
              break;
            case "playlist":
              newPage.playlist_sections.push(props.section);
              break;
          }

          await myUpdateDoc({
            collectionName: "Category_Lobby",
            data: newPage,
            id: "page",
          });

          setIsFetching(false);
          setPage(newPage);

          setSuccessToast("Add section successful");
          break;
        }

        case "edit-section": {
          const { index, section } = props;

          const newPage = { ...page };

          switch (props.variant) {
            case "category":
              Object.assign(newPage.category_sections[index], section);
              break;
            case "playlist":
              Object.assign(newPage.playlist_sections[index], section);
              break;
          }

          await myUpdateDoc({
            collectionName: "Category_Lobby",
            data: newPage,
            id: "page",
          });

          setIsFetching(false);
          setPage(newPage);

          setSuccessToast("Update section successful");
          break;
        }

        case "delete": {
          const newPage = { ...page };

          switch (props.variant) {
            case "category":
              newPage.category_sections.splice(props.index, 1);
              break;
            case "playlist":
              newPage.playlist_sections.splice(props.index, 1);
              break;
          }

          await myUpdateDoc({
            collectionName: "Category_Lobby",
            data: newPage,
            id: "page",
          });

          setSuccessToast("Delete section successful");
          break;
        }

        case "add-category": {
          const { category, sectionIndex } = props;
          const res = await myAddDoc({
            collectionName: "Categories",
            data: category,
          });

          const newCategory: Category = { ...category, id: res.id };

          const newPage = { ...page };
          const target = { ...newPage.category_sections[sectionIndex] };

          (target.target_ids = target.target_ids
            ? target.target_ids + `_${newCategory.id}`
            : newCategory.id),
            Object.assign(newPage.category_sections[sectionIndex], target);

          await myUpdateDoc({
            collectionName: "Category_Lobby",
            data: newPage,
            id: "page",
          });

          setCategories((prev) => [...prev, newCategory]);
          setPage(newPage);

          setSuccessToast("Add new category successful");
        }
      }


      mainProps?.modalRef.current?.close()
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action };
}
