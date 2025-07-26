import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { useRef } from "react";
import useSectionAction from "../hooks/useSectionAction";
import { Modal, ModalRef } from "@/components";
import AddCategoryModal from "./AddCategoryModal";
import useAddCategory from "../hooks/useAddCategory";

type Props = {
  sectionIndex: number;
};

export default function AddNewCategoryBtn({ sectionIndex }: Props) {
  const { action, isFetching } = useSectionAction();

  const { isFetching: addCategoryFetching, addCategory } = useAddCategory();

  const modalRef = useRef<ModalRef>(null);

  const handleSubmit = async (payload: CategorySchema, imageFile?: File) => {
    const newCategory = await addCategory({
      variant: "add",
      category: payload,
      imageFile,
    });

    if (newCategory)
      action({ type: "add-category", category: newCategory, sectionIndex });

    modalRef.current?.close();
  };

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className="p-1"
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <span>Add new category</span>
      </Button>

      <Modal variant="animation" ref={modalRef}>
        <AddCategoryModal
          closeModal={() => modalRef.current?.close()}
          isLoading={isFetching || addCategoryFetching}
          variant="add"
          submit={handleSubmit}
        />
      </Modal>
    </>
  );
}
