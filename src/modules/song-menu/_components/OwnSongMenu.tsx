import { ConfirmModal, Modal, ModalRef } from "@/components";
import EditSongModal from "@/modules/edit-song-modal";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SongMenuContent } from "..";
import useSongItemAction from "@/modules/song-item/_hooks/useSongItemAction";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";
import AddToNewPlaylistMenuItem, {
  AddToPlaylistMenuModal,
} from "./AddToPlaylistMenuItem";
import AddToQueueMenuItem from "./AddToQueueMenuItem";

type Props = {
  song: Song;
};
type Modal = "edit" | "delete" | "add-to-playlist";

export default function OwnSongMenu({ song }: Props) {

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);
  const addToPlaylistModalRef = useRef<ModalRef>(null);

  const { action, loading } = useSongItemAction();

  const handleOpenModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
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
            closeModal={closeModal}
            label={`Delete ' ${song.name} ' ?`}
          />
        );
      case "edit":
        return <EditSongModal modalRef={modalRef} song={song} />;
      case "add-to-playlist":
        return <AddSongToPlaylistModal closeModal={closeModal} songs={[song]} />;
    }
  };

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>own song menu</p>}

        <AddToQueueMenuItem song={song} />

        <AddToNewPlaylistMenuItem modalRef={addToPlaylistModalRef} />

        <button onClick={() => handleOpenModal("edit")}>
          <AdjustmentsHorizontalIcon  />
          <span>Edit</span>
        </button>
        <Link to={`lyric/${song.id}`}>
          <DocumentTextIcon  />
          <span>{song.lyric_id ? "Edit lyric" : "Add lyric"}</span>
        </Link>
        <button onClick={() => handleOpenModal("delete")}>
          <TrashIcon  />
          <span>Delete</span>
        </button>

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon  />
          <span>Download</span>
        </a>
      </SongMenuContent>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>

      <AddToPlaylistMenuModal song={song} modalRef={addToPlaylistModalRef} />
    </>
  );
}
