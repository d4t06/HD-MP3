import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import {
  ClipboardDocumentIcon,
  MusicalNoteIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import EditSongModal from "./EditSongModal";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import ChangeSongFileModal from "./ChangeSongFileModal";
import useDashboardSongItemAction from "../_hooks/useSongItemAction";

type Modal = "edit" | "change-file" | "delete";

export default function EditSongBtn() {
  const { song } = useAddSongContext();

  const { actions, isFetching } = useDashboardSongItemAction();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <Button onClick={() => openModal("edit")} size={"clear"}>
        <PencilIcon />
        <span>Edit</span>
      </Button>

      <Link to={`/dashboard/lyric/${song?.id}`}>
        <Button size={"clear"}>
          <ClipboardDocumentIcon />
          <span>Lyric</span>
        </Button>
      </Link>

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
      </Modal>
    </>
  );
}
