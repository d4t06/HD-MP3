import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { useRef, useState } from "react";
import useSectionAction from "../hooks/useSectionAction";
import { ArrangeModal, Modal, ModalRef } from "@/components";
import AddCategoryModal from "./AddCategoryModal";
import useAddCategory from "../hooks/useAddCategory";

type Props = {
  sectionIndex: number;
  orderedCategories: Category[];
};

type Modal = "add" | "arrange";

export default function AddNewCategoryBtn({
  sectionIndex,
  orderedCategories,
}: Props) {
  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useSectionAction({
    modalRef,
  });

  const { isFetching: addCategoryFetching, addCategory } = useAddCategory();

  const [modal, setModal] = useState<Modal | "">("");

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const handleSubmit = async (payload: CategorySchema, imageFile?: File) => {
    const newCategory = await addCategory({
      variant: "add",
      category: payload,
      imageFile,
    });

    if (newCategory)
      action({
        type: "add-category",
        category: newCategory as Category,
        sectionIndex,
      });

    modalRef.current?.close();
  };

  return (
    <>
      <div className="flex space-x-2 justify-center mt-3">
        <Button onClick={() => openModal("add")}>
          <PlusIcon className="w-6" />
          <span>Add new category</span>
        </Button>

        <Button
          onClick={() => openModal("arrange")}
          disabled={orderedCategories.length < 2}
        >
          <ArrowPathIcon className="w-6" />
          <span>Arrange</span>
        </Button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {modal === "add" && (
          <AddCategoryModal
            modalRef={modalRef}
            isLoading={isFetching || addCategoryFetching}
            variant="add"
            submit={handleSubmit}
          />
        )}

        {modal === "arrange" && (
          <ArrangeModal
            closeModal={() => modalRef.current?.close()}
            data={orderedCategories.map((c) => ({ id: c.id, label: c.name }))}
            isLoading={isFetching}
            submit={(order) =>
              action({
                variant: "category",
                type: "edit-section",
                section: { target_ids: order.join("_") },
                index: sectionIndex,
              })
            }
          />
        )}
      </Modal>
    </>
  );
}
