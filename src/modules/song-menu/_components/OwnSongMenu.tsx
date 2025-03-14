import { ConfirmModal, Modal, ModalRef } from "@/components";
import { usePopoverContext } from "@/components/MyPopup";
import EditSongModal from "@/modules/edit-song-modal";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SongMenuContent } from "..";
import useSongItemAction from "@/modules/song-item/_hooks/useSongItemAction";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";

type Props = {
  song: Song;
  addSongToQueue: () => void;
};
type Modal = "edit" | "delete" | "add-to-playlist";

export default function OwnSongMenu({ song, addSongToQueue }: Props) {
  const { close } = usePopoverContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, loading } = useSongItemAction();

  const handleOpenModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
    close();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const handleDeleteSong = async () => {
    await action({
      variant: "delete",
      song,
    });

    closeModal();
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;
      case "delete":
        return (
          <ConfirmModal
            callback={handleDeleteSong}
            loading={loading}
            close={closeModal}
            label={`Delete ' ${song.name} ' ?`}
          />
        );
      case "edit":
        return <EditSongModal modalRef={modalRef} song={song} />;
      case "add-to-playlist":
        return <AddSongToPlaylistModal closeModal={closeModal} song={song} />;
    }
  };

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>own song menu</p>}

        <button onClick={addSongToQueue}>
          <PlusIcon className="w-5" />
          <span>Add to queue</span>
        </button>

        <button onClick={() => handleOpenModal("add-to-playlist")}>
          <PlusIcon className="w-5" />
          <span>Add to playlist</span>
        </button>

        <button onClick={() => handleOpenModal("edit")}>
          <AdjustmentsHorizontalIcon className="w-5" />
          <span>Edit</span>
        </button>
        <Link to={`lyric/${song.id}`}>
          <DocumentTextIcon className="w-5" />
          <span>{song.is_has_lyric ? "Edit lyric" : "Add lyric"}</span>
        </Link>
        <button onClick={() => handleOpenModal("delete")}>
          <TrashIcon className="w-5" />
          <span>Delete</span>
        </button>

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>
      </SongMenuContent>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
