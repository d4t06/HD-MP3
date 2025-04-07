import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button, ModalWrapper } from "@/pages/dashboard/_components";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "../_hooks/usePlaylistAction";
import AddPlaylistModal from "@/modules/add-playlist-form";
import AddSongsToPlaylistModal from "@/modules/add-songs-to-playlist";
import { ContentWrapper } from "@/pages/dashboard/_components/ui/ModalWrapper";
import ButtonCtaFrame from "@/pages/dashboard/_components/ui/buttonCtaFrame";

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
            <ContentWrapper className="w-[500px]">
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
                close={closeModal}
              />
            </ContentWrapper>
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
          <AddSongsToPlaylistModal
            isLoading={isFetching}
            submit={(songs) =>
              handlePlaylistAction({
                variant: "add-songs",
                songs,
              })
            }
            closeModal={closeModal}
          />
        );
    }
  };

  return (
    <>
      <ButtonCtaFrame>
        <Button onClick={() => openModal("edit")} size={"clear"}>
          <PencilIcon className="w-5" />

          <span>Edit</span>
        </Button>

        <Button onClick={() => openModal("delete")} size={"clear"}>
          <TrashIcon className="w-5" />

          <span>Delete</span>
        </Button>

        <Button onClick={() => openModal("add-song-to-playlist")} size={"clear"}>
          <PlusIcon className="w-5" />
          <span>Add song</span>
        </Button>
      </ButtonCtaFrame>

      <Modal wrapped={false} variant="animation" ref={modalRef}>
        <ModalWrapper className="w-[unset]">{renderModal()}</ModalWrapper>
      </Modal>
    </>
  );
}
