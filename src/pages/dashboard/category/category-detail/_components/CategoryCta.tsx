import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button, ButtonCtaFrame } from "@/pages/dashboard/_components";
import { PencilIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useCategoryContext } from "../CategoryContext";
import AddCategoryModal from "../../_components/AddCategoryModal";
import CategoryBannerModal from "./CategoryBannerModal";
import useAddCategory from "../../hooks/useAddCategory";

type Modal = "edit" | "delete" | "banner";

export default function CategoryCta() {
  const { category, setCategory } = useCategoryContext();

  const [modal, setModal] = useState<Modal | "">("");

  const { addCategory, isFetching } = useAddCategory();

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
      const newCategory = { ...category };

      Object.assign(newCategory, payload);

      setCategory(newCategory);
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
            loading={false}
            label={"Delete playlist ?"}
            callback={() => {}}
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
