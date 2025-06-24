import { Modal, ModalRef } from "@/components";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";
import { RefObject } from "react";
import { useAuthContext } from "@/stores";
import { PlusIcon } from "@heroicons/react/24/outline";

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
      <AddSongToPlaylistModal
        closeModal={() => modalRef.current?.close()}
        songs={[song]}
      />
    </Modal>
  );
}

export default function AddToPlaylistMenuItem({ modalRef }: Props) {
  const { user } = useAuthContext();

  if (!user) return <></>;

  return (
    <button onClick={() => modalRef.current?.open()}>
      <PlusIcon />
      <span>Add to playlist</span>
    </button>
  );
}
