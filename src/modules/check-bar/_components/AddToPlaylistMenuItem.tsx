import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { RefObject } from "react";
import { useAuthContext, useSongSelectContext } from "@/stores";
import AddSongToPlaylistModal from "@/modules/song-menu/_components/AddSongToPlaylistModal";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export function AddSelectSongsToPlaylistMenuModal({
  modalRef,
}: {
  modalRef: RefObject<ModalRef>;
}) {
  const { user } = useAuthContext();

  const { selectedSongs } = useSongSelectContext();

  if (!user) return <></>;

  return (
    <Modal variant="animation" ref={modalRef}>
      <AddSongToPlaylistModal
        closeModal={() => modalRef.current?.close()}
        songs={selectedSongs}
      />
    </Modal>
  );
}

export default function AddToPlaylistMenuItem({ modalRef }: Props) {
  const { user } = useAuthContext();

  const handleOpenModal = () => {
    modalRef.current?.open();
  };

  if (!user) return <></>;

  return (
    <button onClick={handleOpenModal}>
      <PlusIcon className="w-5" />
      <span>Add to playlist</span>
    </button>
  );
}
