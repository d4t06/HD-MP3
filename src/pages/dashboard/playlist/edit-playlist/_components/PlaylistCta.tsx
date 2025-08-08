import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import {
  ConfirmModal,
  Modal,
  ModalContentWrapper,
  ModalRef,
} from "@/components";
import { Button, ButtonCtaFrame } from "@/pages/dashboard/_components";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "../_hooks/usePlaylistAction";
import AddPlaylistModal from "@/modules/add-playlist-modal";
import AddSongsToPlaylistModal from "@/modules/add-songs-to-playlist";
import { usePlaylistContext } from "../PlaylistContext";

type Modal = "edit" | "delete" | "add-song-to-playlist";

export default function DashboardPlaylistCta() {
  const { songs } = usePlaylistContext();
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, playlist, isFetching } = useDashboardPlaylistActions();

  const openModal = (m: Modal) => {
    setModal(m);
    if (modal === "add-song-to-playlist")
      modalRef.current?.setModalPersist(true);

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
            <ModalContentWrapper className="w-[600px]">
              <AddPlaylistModal
                submit={(_playlist, imageFile) =>
                  handlePlaylistAction({
                    variant: "edit-playlist",
                    playlist: _playlist,
                    imageFile,
                  })
                }
                variant="edit"
                isLoading={isFetching}
                playlist={playlist}
                modalRef={modalRef}
              />
            </ModalContentWrapper>
          </>
        );

      case "delete":
        return (
          <ConfirmModal
            loading={isFetching}
            label={"Delete playlist ?"}
            callback={() =>
              handlePlaylistAction({ variant: "delete-playlist" })
            }
            closeModal={closeModal}
          />
        );

      case "add-song-to-playlist":
        return (
          <AddSongsToPlaylistModal
            isLoading={isFetching}
            submit={(songs) =>
              handlePlaylistAction({
                variant: "add-songs",
                songs,
              })
            }
            closeModal={closeModal}
            current={songs.map((s) => s.id)}
          />
        );
    }
  };

  return (
    <>
      <ButtonCtaFrame>
        <Button onClick={() => openModal("edit")} size={"clear"}>
          <PencilIcon />

          <span>Edit</span>
        </Button>

        <Button onClick={() => openModal("delete")} size={"clear"}>
          <TrashIcon />

          <span>Delete</span>
        </Button>

        <Button
          onClick={() => openModal("add-song-to-playlist")}
          size={"clear"}
        >
          <PlusIcon />
          <span>Add song</span>
        </Button>
      </ButtonCtaFrame>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
