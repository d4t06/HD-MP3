import {
  ConfirmModal,
  Modal,
  ModalContentWrapper,
  ModalRef,
} from "@/components";
import { Button, ButtonCtaFrame } from "@/pages/dashboard/_components";
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
      <div className="mt-3">
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

      <Modal variant="animation" ref={modalRef}>
        {modal === "more" && singer && (
          <ModalContentWrapper>{singer.description}</ModalContentWrapper>
        )}
        {modal === "edit" && (
          <AddSingerModal modalRef={modalRef} variant="edit" />
        )}
        {modal === "delete" && singer && (
          <ConfirmModal
            label={`Delete singer '${singer.name}'`}
            loading={isFetching}
            callback={() => action({ variant: "delete" })}
            closeModal={closeModal}
          />
        )}
      </Modal>
    </>
  );
}
