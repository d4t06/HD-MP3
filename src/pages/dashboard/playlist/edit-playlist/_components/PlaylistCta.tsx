import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import SongSelectProvider from "@/stores/SongSelectContext";
import { ConfirmModal, Modal, ModalRef } from "@/components";
import AddSongsToPlaylistModal from "./AddSongsToPlaylistModal";
import { Button } from "@/pages/dashboard/_components";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "../_hooks/usePlaylistAction";
import AddPlaylistModal from "@/modules/add-playlist-form";

type Modal = "edit" | "delete" | "add-song-to-playlist";

export default function DashboardPlaylistCta() {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, playlist, isFetching } = useDashboardPlaylistActions();

  const openModal = (m: Modal) => {
    setModal(m);
    if (modal === "add-song-to-playlist") modalRef.current?.setModalPersist(true);

    modalRef.current?.open();
  };
  const closeModal = () => modalRef.current?.close();

  const handlePlaylistAction = async (props: PlaylistActionProps) => {
    await action(props);
    closeModal();
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;
      case "edit":
        if (!playlist) return "Playlist is undefined";

        return (
          <>
            <AddPlaylistModal
              submit={(playlist, imageFile) =>
                handlePlaylistAction({
                  variant: "edit-playlist",
                  playlist,
                  imageFile,
                })
              }
              variant="edit"
              isLoading={isFetching}
              playlist={playlist}
              close={closeModal}
            />
          </>
        );

      case "delete":
        return (
          <ConfirmModal
            loading={isFetching}
            label={"Delete playlist ?"}
            callback={() => handlePlaylistAction({ variant: "delete-playlist" })}
            close={closeModal}
          />
        );

      case "add-song-to-playlist":
        return (
          <SongSelectProvider>
            <AddSongsToPlaylistModal closeModal={closeModal} />
          </SongSelectProvider>
        );
    }
  };

  const classes = {
    button: "p-1.5",
  };

  return (
    <div className="space-x-2">
      <Button
        onClick={() => openModal("edit")}
        size={"clear"}
        className={`${classes.button} `}
      >
        <PencilIcon className="w-5" />
      </Button>

      <Button
        onClick={() => openModal("delete")}
        size={"clear"}
        className={`${classes.button} `}
      >
        <TrashIcon className="w-5" />
      </Button>

      <Button
        onClick={() => openModal("add-song-to-playlist")}
        size={"clear"}
        className={`${classes.button} `}
      >
        <PlusIcon className="w-5" />
        <span>Add song</span>
      </Button>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </div>
  );
}
