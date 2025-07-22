import { ConfirmModal, Modal, ModalRef } from "@/components";
import { useRef, useState } from "react";
import AddGenreModal from "./AddGenreModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ItemRightCtaFrame from "../../_components/ui/ItemRightCtaFrame";
import useGenreAction from "../useGenreAction";

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

  const handleDeleteGenre = async () => {
    await action({ type: "delete", id: genre.id });
    // closeModal();
  };

  return (
    <>
      <ItemRightCtaFrame>
        <span>{genre.name}</span>

        <div>
          <button className="" onClick={() => openModal("edit")}>
            <PencilIcon className="w-5" />
          </button>
          <button onClick={() => openModal("delete")}>
            <TrashIcon className="w-5" />
          </button>
        </div>
      </ItemRightCtaFrame>

      <Modal variant="animation" ref={modalRef}>
        {modal === "edit" && (
          <AddGenreModal type="edit" genre={genre} closeModal={closeModal} />
        )}

        {modal === "delete" && (
          <ConfirmModal
            callback={handleDeleteGenre}
            close={closeModal}
            loading={isFetching}
            label={`Delete genre '${genre.name}'`}
          />
        )}
      </Modal>
    </>
  );
}
