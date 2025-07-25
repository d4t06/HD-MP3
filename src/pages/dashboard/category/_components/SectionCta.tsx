import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { AddItem, ConfirmModal, Modal, ModalRef } from "@/components";
import { useRef, useState } from "react";
import useSectionAction from "../hooks/useSectionAction";

type Props = {
  variant: "category" | "playlist";
  name: string;
  index: number;
  section: LobbySection;
};

type Modal = "edit" | "delete";

export default function SectionCta({ name, index, variant, section }: Props) {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useSectionAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <div className="flex space-x-2 ml-4">
        <Button
          onClick={() => openModal("edit")}
          className="p-1"
          size={"clear"}
        >
          <PencilIcon className="w-6" />
        </Button>

        <Button
          onClick={() => openModal("delete")}
          className="p-1"
          size={"clear"}
        >
          <TrashIcon className="w-6" />
        </Button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {modal === "edit" && (
          <AddItem
            initValue={name}
            loading={isFetching}
            cbWhenSubmit={(v) =>
              action({
                type: "edit-section",
                section: { name: v },
                index,
                variant,
              })
            }
            closeModal={closeModal}
            title={
              variant === "category"
                ? "Edit category section"
                : "Edit playlist section"
            }
          />
        )}

        {modal === "delete" && (
          <ConfirmModal
            callback={() => action({ type: "delete", index, variant })}
            closeModal={closeModal}
            loading={isFetching}
            label={`Delete section '${section.name}'`}
          />
        )}
      </Modal>
    </>
  );
}
