// import useDashboardSongItemAction, {
// } from "@/pages/dashboard/_hooks/useSongItemAction";
import { DashboardSongPopupWrapper } from "..";
import { Link } from "react-router-dom";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { plusIcon } from "@/assets/icon";
import { Modal, ModalRef } from "@/components";
import AddPlaylistsModal from "@/pages/dashboard/category/category-detail/_components/AddPlaylistsModal";
import { useRef, useState } from "react";
import useSongMenuAction from "../useSongMenuAction";

type SongsMenuModal = "add-to-playlists";

export default function SongMenu({ song }: { song: Song }) {
  const { action, isFetching } = useSongMenuAction();

  const [modal, setModal] = useState<SongsMenuModal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();
  const openModal = (m: SongsMenuModal) => {
    setModal(m);

    modalRef.current?.open();
  };

  return (
    <>
      <DashboardSongPopupWrapper song={song}>
        <Link to={`/dashboard/lyric/${song.id}`}>
          <DocumentTextIcon className={`w-5`} />

          <span>{song.lyric_id ? 'Add' : 'Edit'} lyric</span>
        </Link>
        <button onClick={() => openModal("add-to-playlists")}>
          <span className="w-5">{plusIcon}</span>

          <span>Add to playlists</span>
        </button>
      </DashboardSongPopupWrapper>

      <Modal ref={modalRef} variant="animation">
        {modal === "add-to-playlists" && (
          <AddPlaylistsModal
            closeModal={closeModal}
            current={[]}
            isLoading={isFetching}
            submit={(playlists) =>
              action({ variant: "add-to-playlists", playlists, song })
            }
          />
        )}
      </Modal>
    </>
  );
}
