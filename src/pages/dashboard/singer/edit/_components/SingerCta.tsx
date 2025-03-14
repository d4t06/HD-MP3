import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
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
      <button onClick={() => openModal("more")} className="text-sm ml-auto !mt-0">See more</button>

      <div className="!mt-auto">
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
      </div>

      {modal && (
        <Modal ref={modalRef} variant="animation">
          {modal === "more" && singer && (
            <div className="w-[400px] max-w-[calc(100vw-40px)]">{singer.description}</div>
          )}
          {modal === "edit" && <AddSingerModal closeModal={closeModal} variant="edit" />}
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
