import { ModalRef } from "@/components";
import { myUpdateDoc } from "@/services/firebaseService";
import { useToastContext, usePageContext } from "@/stores";
import { RefObject, useState } from "react";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useSliderSectionAction(mainProps?: Props) {
  const TARGET_PAGE = location.hash.includes("homepage") ? "home" : "category";

  const {
    categoryPage,
    homePage,
    setCategoryPage,
    setHomePage,
    categorySliders,
    homeSliders,
  } = usePageContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const page = TARGET_PAGE === "home" ? homePage : categoryPage;
  const setPage = TARGET_PAGE === "home" ? setHomePage : setCategoryPage;
  const sliders = TARGET_PAGE === "home" ? homeSliders : categorySliders;

  type Edit = {
    variant: "add-category";
    categories: Category[];
  };

  type Remove = {
    variant: "remove-category";
    id: string;
  };

  type ArrangePlaylists = {
    variant: "arrange";
    order: string[];
  };

  const updatePageDoc = async (categories: Category[]) => {
    if (!page) return;

    const newPage = { ...page };

    newPage.category_ids = categories.map((p) => p.id).join("_");

    await myUpdateDoc({
      collectionName: "Page_Config",
      data: newPage,
      id: TARGET_PAGE,
    });

    setPage(newPage);
  };

  const action = async (props: Edit | Remove | ArrangePlaylists) => {
    try {
      if (!page) return;

      console.log(TARGET_PAGE);

      // return;

      setIsFetching(true);
      switch (props.variant) {
        case "add-category": {
          const newPlaylists = [...sliders, ...props.categories];

          updatePageDoc(newPlaylists);
          setSuccessToast("Add category successful");

          break;
        }

        case "remove-category": {
          const newPlaylists = sliders.filter((p) => p.id !== props.id);

          updatePageDoc(newPlaylists);

          setSuccessToast("Remove category successful");

          break;
        }

        case "arrange": {
          const newPage = { ...page };

          newPage.category_ids = props.order.join("_");

          await myUpdateDoc({
            collectionName: "Page_Config",
            data: newPage,
            id: TARGET_PAGE,
          });

          setPage(newPage);

          break;
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
