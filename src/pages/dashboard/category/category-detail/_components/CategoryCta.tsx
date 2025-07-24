import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button, ButtonCtaFrame } from "@/pages/dashboard/_components";
import { PencilIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useCategoryContext } from "../CategoryContext";
import AddCategoryModal from "../../_components/AddCategoryModal";
import CategoryBannerModal from "./CategoryBannerModal";

type Modal = "edit" | "delete" | "banner";

export default function CategoryCta() {
  const { category } = useCategoryContext();

  const [modal, setModal] = useState<Modal | "">("");

  const openModal = (m: Modal) => {
    setModal(m);

    modalRef.current?.open();
  };
  const closeModal = () => modalRef.current?.close();

  const modalRef = useRef<ModalRef>(null);

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
              submit={() => {}}
              variant="edit"
              isLoading={false}
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
            close={closeModal}
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
