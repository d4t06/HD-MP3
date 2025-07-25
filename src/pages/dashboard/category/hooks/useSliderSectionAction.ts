import { ModalRef } from "@/components";
import { myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { RefObject, useState } from "react";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useSliderSectionAction(mainProps?: Props) {
  const { page, setPage, orderedSliders } = useCategoryLobbyContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

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
      collectionName: "Category_Lobby",
      data: newPage,
      id: "page",
    });

    setPage(newPage);
  };

  const action = async (props: Edit | Remove | ArrangePlaylists) => {
    try {
      if (!page) return;
      setIsFetching(true);
      switch (props.variant) {
        case "add-category": {
          const newPlaylists = [...orderedSliders, ...props.categories];

          updatePageDoc(newPlaylists);
          setSuccessToast("Add category successful");

          break;
        }

        case "remove-category": {
          const newPlaylists = orderedSliders.filter((p) => p.id !== props.id);

          updatePageDoc(newPlaylists);

          setSuccessToast("Remove category successful");

          break;
        }

        case "arrange": {
          const newPage = { ...page };

          newPage.category_ids = props.order.join("_");

          await myUpdateDoc({
            collectionName: "Category_Lobby",
            data: newPage,
            id: "page",
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
