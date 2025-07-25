import { ConfirmModal, ModalContentWrapper, ModalRef } from "@/components";
import {
  Button,
  DashboardModal,
  ButtonCtaFrame,
} from "@/pages/dashboard/_components";
import { useRef, useState } from "react";
import AddSingerModal from "../../_components/AddSingerModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import useDashboardSingerAction from "../_hooks/useSingerAction";

export default function SingerCta() {
  const [modal, setModal] = useState<"edit" | "delete" | "more" | "">("");
  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching, singer } = useDashboardSingerAction();

  const openModal = (m: typeof modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <button
        onClick={() => openModal("more")}
        className="text-sm ml-auto !mt-0"
      >
        See more
      </button>

      <div className="mt-3 md:!mt-auto">
        <ButtonCtaFrame>
          <Button
            onClick={() => openModal("edit")}
            className={`md:px-3`}
            size={"clear"}
          >
            <PencilIcon className="w-6" />
            <span>Edit singer</span>
          </Button>

          <Button
            onClick={() => openModal("delete")}
            className={`md:px-3`}
            size={"clear"}
          >
            <TrashIcon className="w-6" />
            <span>Delete</span>
          </Button>
        </ButtonCtaFrame>
      </div>

      <DashboardModal ref={modalRef}>
        {modal === "more" && singer && (
          <ModalContentWrapper>{singer.description}</ModalContentWrapper>
        )}
        {modal === "edit" && (
          <AddSingerModal closeModal={closeModal} variant="edit" />
        )}
        {modal === "delete" && singer && (
          <ConfirmModal
            label={`Delete singer '${singer.name}'`}
            loading={isFetching}
            callback={() => action({ variant: "delete" })}
            closeModal={closeModal}
          />
        )}
      </DashboardModal>
    </>
  );
}
