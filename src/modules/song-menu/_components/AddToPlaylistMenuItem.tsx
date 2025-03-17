import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";
import { usePopoverContext } from "@/components/MyPopup";
import { RefObject } from "react";
import { useAuthContext } from "@/stores";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export function AddToPlaylistMenuModal({
  modalRef,
  song,
}: {
  modalRef: RefObject<ModalRef>;
  song: Song;
}) {
  const { user } = useAuthContext();

  if (!user) return <></>;

  return (
    <Modal variant="animation" ref={modalRef}>
      <AddSongToPlaylistModal closeModal={() => modalRef.current?.close()} song={song} />
    </Modal>
  );
}

export default function AddToPlaylistMenuItem({ modalRef }: Props) {
  const { user } = useAuthContext();
  const { close } = usePopoverContext();

  const handleOpenModal = () => {
    modalRef.current?.open();
    close();
  };

  if (!user) return <></>;

  return (
    <button onClick={handleOpenModal}>
      <PlusIcon className="w-5" />
      <span>Add to playlist</span>
    </button>
  );
}
