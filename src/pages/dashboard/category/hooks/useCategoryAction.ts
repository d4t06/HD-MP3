import { myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { RefObject, useState } from "react";
import { ModalRef } from "@/components";
import { usePageContext } from "@/stores";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useCategoryAction(mainProps?: Props) {
  const { categories, setCategories } = usePageContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type Edit = {
    type: "edit";
    category: Partial<GenreSchema>;
    id: string;
  };

  type Delete = {
    type: "delete";
    id: string;
  };

  const action = async (props: Edit | Delete) => {
    try {
      setIsFetching(true);
      switch (props.type) {
        case "edit": {
          await myUpdateDoc({
            collectionName: "Categories",
            data: props.category,
            id: props.id,
          });

          const newCategories = [...categories];

          const index = newCategories.findIndex((g) => g.id === props.id);

          const target = { ...categories[index] };
          Object.assign(target, props.category);
          newCategories[index] = target;

          setCategories(newCategories);
          setSuccessToast("Edit category successful");

          break;
        }

        case "delete": {
          // await myDeleteDoc({
          //   collectionName: "Categories",
          //   id: props.id,
          // });

          // setCategories((prev) => prev.filter((g) => g.id !== props.id));
          // setSuccessToast("Delete category successful");

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
