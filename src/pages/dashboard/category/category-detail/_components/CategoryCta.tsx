import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button, ButtonCtaFrame } from "@/pages/dashboard/_components";
import { PencilIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useCategoryContext } from "../CategoryContext";
import AddCategoryModal from "../../_components/AddCategoryModal";
import CategoryBannerModal from "./CategoryBannerModal";
import useAddCategory from "../../hooks/useAddCategory";
import { usePageContext, useToastContext } from "@/stores";
import useCategoryDetailAction from "../_hooks/useCategoryDetailAction";

type Modal = "edit" | "delete" | "banner";

export default function CategoryCta() {
  const { categories, setCategories } = usePageContext();
  const { setSuccessToast } = useToastContext();
  const { category, setCategory } = useCategoryContext();

  const [modal, setModal] = useState<Modal | "">("");

  const { addCategory, isFetching } = useAddCategory();
  const { action, isFetching: isDeleting } = useCategoryDetailAction();

  const openModal = (m: Modal) => {
    setModal(m);

    modalRef.current?.open();
  };
  const closeModal = () => modalRef.current?.close();

  const modalRef = useRef<ModalRef>(null);

  const handleUpdateCategory = async (
    payload: Partial<CategorySchema>,
    imageFile?: File,
  ) => {
    if (!category) return;

    const success = await addCategory({
      variant: "edit",
      category: payload,
      id: category.id,
      imageFile,
    });

    if (success) {
      const newCategories = [...categories];
      const newCategory = { ...category };

      Object.assign(newCategory, payload);

      const index = newCategories.findIndex((c) => c.id === category.id);
      if (index !== -1) {
        Object.assign(newCategories[index], payload);
        setCategories(newCategories);
      }

      setCategory(newCategory);

      setSuccessToast("Category updated");
      closeModal();
    }
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;

      case "banner":
        return <CategoryBannerModal closeModal={closeModal} />;
      case "edit":
        if (!category) return "Playlist is undefined";

        return (
          <>
            <AddCategoryModal
              submit={handleUpdateCategory}
              variant="edit"
              isLoading={isFetching}
              category={category}
              closeModal={closeModal}
            />
          </>
        );

      case "delete":
        return (
          <ConfirmModal
            loading={isDeleting}
            label={"Delete playlist ?"}
            callback={() => action({ variant: "delete" })}
            closeModal={closeModal}
          />
        );
    }
  };

  return (
    <>
      <ButtonCtaFrame>
        <Button onClick={() => openModal("edit")} size={"clear"}>
          <PencilIcon />
          <span>Edit</span>
        </Button>

        <Button onClick={() => openModal("banner")} size={"clear"}>
          <PhotoIcon />
          <span>Banner</span>
        </Button>

        <Button onClick={() => openModal("delete")} size={"clear"}>
          <TrashIcon />
          <span>Delete</span>
        </Button>
      </ButtonCtaFrame>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
