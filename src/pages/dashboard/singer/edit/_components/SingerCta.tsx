import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { useRef, useState } from "react";
import AddSingerModal from "../../_components/AddSingerModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import useDashboardSingerAction from "../_hooks/useSingerAction";

export default function SingerCta() {
  const [modal, setModal] = useState<"edit" | "delete" | "">("");
  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useDashboardSingerAction();

  const openModal = (m: typeof modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <div className="space-x-2">
        <Button
          onClick={() => openModal("edit")}
          className={`h-[32px]  space-x-1 px-2.5`}
          size={"clear"}
        >
          <PencilIcon className="w-6" />
          <div className="hidden md:block">Edit singer</div>
        </Button>

        <Button
          onClick={() => openModal("delete")}
          className={`h-[32px]  space-x-1 px-2.5`}
          size={"clear"}
        >
          <TrashIcon className="w-6" />
          <div className="hidden md:block">Delete</div>
        </Button>
      </div>

      {modal && (
        <Modal ref={modalRef} variant="animation">
          {modal === "edit" && <AddSingerModal close={closeModal} variant="edit" />}
          {modal === "delete" && (
            <ConfirmModal
              loading={isFetching}
              callback={() => action({ variant: "delete" })}
              close={closeModal}
            />
          )}
        </Modal>
      )}
    </>
  );
}
