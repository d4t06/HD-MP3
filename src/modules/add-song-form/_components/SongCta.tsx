import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import {
  ClipboardDocumentIcon,
  MusicalNoteIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditSongModal from "./EditSongModal";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import ChangeSongFileModal from "./ChangeSongFileModal";
import useDashboardSongItemAction from "../_hooks/useSongItemAction";

type Modal = "edit" | "change-file" | "delete" | "navigate";

type Prosp = {
  isValidToSubmit: boolean;
};

export default function EditSongBtn({ isValidToSubmit }: Prosp) {
  const { song } = useAddSongContext();

  const navigator = useNavigate();
  const { actions, isFetching } = useDashboardSongItemAction();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  const handleNavigate = () => {
    if (!song) return;

    if (isValidToSubmit) {
      openModal("navigate");
    } else navigator(`/dashboard/lyric/${song.id}`);
  };

  return (
    <>
      <Button onClick={() => openModal("edit")} size={"clear"}>
        <PencilIcon />
        <span>Edit</span>
      </Button>

      <Button onClick={handleNavigate} size={"clear"}>
        <ClipboardDocumentIcon />
        <span>Lyric</span>
      </Button>

      <Button onClick={() => openModal("change-file")} size={"clear"}>
        <MusicalNoteIcon />
        <span>Change song file</span>
      </Button>

      <Button onClick={() => openModal("delete")} size={"clear"}>
        <TrashIcon />
        <span>Delete</span>
      </Button>

      <Modal variant="animation" ref={modalRef}>
        {modal === "edit" && <EditSongModal closeModal={closeModal} />}
        {modal === "change-file" && (
          <ChangeSongFileModal closeModal={closeModal} />
        )}

        {modal === "delete" && song && (
          <ConfirmModal
            loading={isFetching}
            label={`Delete '${song.name}' ?`}
            desc={"This action cannot be undone"}
            callback={() =>
              actions({
                variant: "delete",
                song,
              })
            }
            closeModal={closeModal}
          />
        )}

        {modal === "navigate" && song && (
          <ConfirmModal
            loading={isFetching}
            label={`Dischard change ?`}
            desc={"This action cannot be undone"}
            callback={() => navigator(`/dashboard/lyric/${song.id}`)}
            closeModal={closeModal}
          />
        )}
      </Modal>
    </>
  );
}
