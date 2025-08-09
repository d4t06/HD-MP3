import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useSongSelectContext } from "@/stores";
import AddSongToPlaylistModal from "@/modules/song-menu/_components/AddSongToPlaylistModal";

export default function AddToPlaylistBtn() {
  const { selectedSongs, resetSelect } = useSongSelectContext();

  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <button onClick={() => modalRef.current?.open()}>
        <PlusIcon className="w-5" />
        <span>Add to playlist</span>
      </button>

      <Modal variant="animation" ref={modalRef}>
        <AddSongToPlaylistModal
          closeModal={() => {
            modalRef.current?.close();
            resetSelect();
          }}
          songs={selectedSongs}
        />
      </Modal>
    </>
  );
}
