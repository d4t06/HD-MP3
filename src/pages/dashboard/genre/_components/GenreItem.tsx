import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Frame, ModalWrapper } from "../../_components";
import { useRef, useState } from "react";
import AddGenreModal from "./AddGenreModal";
import { useGenreAction } from "../../_hooks";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  genre: Genre;
};

type Modal = "edit" | "delete";

export default function GenreItem({ genre }: Props) {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useGenreAction();

  const openModal = (m: Modal) => {
    setModal(m);

    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <Frame className="mx-1 mt-2 flex items-center">
        {genre.name}

        <div className="pl-2 ml-2 border border-transparent border-l-black/10 flex space-x-1 items-center">
          <button onClick={() => openModal("edit")}>
            <PencilIcon className="w-5" />
          </button>
          <button onClick={() => openModal("delete")}>
            <TrashIcon className="w-5" />
          </button>
        </div>
      </Frame>

      <Modal variant="animation" ref={modalRef} wrapped={false}>
        {modal === "edit" && (
          <AddGenreModal type="edit" genre={genre} closeModal={closeModal} />
        )}

        {modal === "delete" && (
          <ModalWrapper>
            <ConfirmModal
              callback={() => action({ type: "delete", id: genre.id })}
              close={closeModal}
              loading={isFetching}
              label={`Delete genre '${genre.name}'`}
            />
          </ModalWrapper>
        )}
      </Modal>
    </>
  );
}
