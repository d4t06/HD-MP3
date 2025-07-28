import { myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { RefObject, useState } from "react";
import { ModalRef } from "@/components";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { usePageContext } from "@/stores";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useSectionAction(mainProps?: Props) {
  const {
    categoryPage,
    homePage,
    setHomePage,
    setCategoryPage,
    setCategories,
  } = usePageContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const TARGET_PAGE = location.hash.includes("homepage") ? "home" : "category";
  const page = TARGET_PAGE === "home" ? homePage : categoryPage;
  const setPage = TARGET_PAGE === "home" ? setHomePage : setCategoryPage;

  type Add = {
    type: "add-section";
    section: PageSection;
    variant: "category" | "playlist";
  };

  type AddCategory = {
    type: "add-category";
    category: Category;
    sectionIndex: number;
  };

  type Edit = {
    type: "edit-section";
    variant: "category" | "playlist";
    section: Partial<PageSection>;
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
            collectionName: "Page_Config",
            data: newPage,
            id: TARGET_PAGE,
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
            collectionName: "Page_Config",
            data: newPage,
            id: TARGET_PAGE,
          });

          setIsFetching(false);
          setPage(newPage);

          setSuccessToast("Update section successful");
          break;
        }

        case "delete": {
          const batch = writeBatch(db);

          const newPage = { ...page };

          switch (props.variant) {
            case "category":
              const targetIds =
                newPage.category_sections[props.index].target_ids;

              // delete categories
              if (targetIds) {
                targetIds
                  .split("_")
                  .forEach((id) => batch.delete(doc(db, "Categories", id)));
              }

              newPage.category_sections.splice(props.index, 1);
              break;
            case "playlist":
              newPage.playlist_sections.splice(props.index, 1);
              break;
          }

          batch.update(doc(db, "Page_Config", TARGET_PAGE), newPage);

          await batch.commit();

          setSuccessToast("Delete section successful");
          break;
        }

        case "add-category": {
          const { category, sectionIndex } = props;

          const newPage = { ...page };
          const target = { ...newPage.category_sections[sectionIndex] };

          (target.target_ids = target.target_ids
            ? target.target_ids + `_${category.id}`
            : category.id),
            Object.assign(newPage.category_sections[sectionIndex], target);

          await myUpdateDoc({
            collectionName: "Page_Config",
            data: newPage,
            id: TARGET_PAGE,
          });

          setCategories((prev) => [...prev, category]);
          setPage(newPage);

          setSuccessToast("Add new category successful");
        }
      }

      mainProps?.modalRef.current?.close();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action };
}
