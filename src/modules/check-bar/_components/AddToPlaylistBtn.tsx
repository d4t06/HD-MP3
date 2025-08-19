import { Modal, ModalRef } from "@/components";
import { useRef } from "react";
import { useSongSelectContext } from "@/stores";
import AddSongToPlaylistModal from "@/modules/song-menu/_components/AddSongToPlaylistModal";
import { plusIcon } from "@/assets/icon";

export default function AddToPlaylistBtn() {
  const { selectedSongs, resetSelect } = useSongSelectContext();

  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <button onClick={() => modalRef.current?.open()}>
        <p className="w-5">{plusIcon}</p>
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
