import { Button, ButtonCtaFrame } from "@/pages/dashboard/_components";
import {
  ConfirmModal,
  Modal,
  ModalContentWrapper,
  ModalRef,
} from "@/components";
import { useRef, useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddAlbumModal from "@/modules/add-album-modal";
import { useAlbumContext } from "../AlbumContext";
import useAlbumAction, { AlbumActionProps } from "../_hooks/useAlbumAction";
import AddSongsToPlaylistModal from "@/modules/add-songs-to-playlist";

type Modal = "edit" | "delete" | "add-songs";

export default function AlbumCta() {
  const { album, songs, updateAlbumData } = useAlbumContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { isFetching, action } = useAlbumAction();

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };
  const closeModal = () => {
    modalRef.current?.close();
  };

  const handlePlaylistAction = async (props: AlbumActionProps) => {
    await action(props);
    closeModal();
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;
      case "edit":
        if (!album) return "Playlist is undefined";

        return (
          <>
            <ModalContentWrapper className="w-[600px]">
              <AddAlbumModal
                modalRef={modalRef}
                variant="edit"
                afterSubmit={(data) => {
                  updateAlbumData(data);
                }}
                album={album}
              />
            </ModalContentWrapper>
          </>
        );

      case "delete":
        return (
          <ConfirmModal
            loading={isFetching}
            label={"Delete playlist ?"}
            callback={() => handlePlaylistAction({ variant: "delete" })}
            closeModal={closeModal}
          />
        );

      case "add-songs":
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
      <div>
        <ButtonCtaFrame>
          <Button onClick={() => openModal("edit")} size={"clear"}>
            <PencilIcon />

            <span>Edit</span>
          </Button>
          <Button onClick={() => openModal("delete")} size={"clear"}>
            <TrashIcon />

            <span>Delete</span>
          </Button>
          <Button onClick={() => openModal("add-songs")} size={"clear"}>
            <PlusIcon />
            <span>Add song</span>
          </Button>
        </ButtonCtaFrame>
      </div>

      <Modal ref={modalRef} variant="animation">
        {renderModal()}
      </Modal>
    </>
  );
}
