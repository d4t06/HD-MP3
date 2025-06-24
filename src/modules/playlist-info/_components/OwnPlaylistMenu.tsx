import {
  ConfirmModal,
  CopyLinkMenuItem,
  Modal,
  ModalContentWrapper,
  ModalRef,
} from "@/components";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import usePlaylistAction from "../_hooks/usePlaylistAction";
import AddPlaylistModal from "@/modules/add-playlist-form";
import { PlaylistMenuPopupContent } from "./PlaylistMenuBtn";

type Modal = "edit" | "delete";

export default function OwnPlaylistMenu() {
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = usePlaylistAction();

  const openModal = (m: Modal) => {
    setModal(m);

    modalRef.current?.open();
  };
  const closeModal = () => modalRef.current?.close();

  const handleEditPlaylist = async (
    playlist: PlaylistSchema,
    imageFile?: File,
  ) => {
    if (!currentPlaylist) return;

    await action({
      variant: "edit",
      playlist: currentPlaylist,
      data: playlist,
      imageFile,
    });
    closeModal();
  };

  const renderModal = () => {
    if (!currentPlaylist) return <></>;

    switch (modal) {
      case "":
        return <></>;
      case "edit":
        return (
          <ModalContentWrapper className="w-[600px]">
            <AddPlaylistModal
              isLoading={isFetching}
              playlist={currentPlaylist}
              submit={handleEditPlaylist}
              variant="edit"
              close={closeModal}
            />
          </ModalContentWrapper>
        );

      case "delete":
        return (
          <ConfirmModal
            loading={isFetching}
            label={`Delete playist ' ${currentPlaylist.name} ' ?`}
            callback={() =>
              action({
                variant: "delete",
                playlist: currentPlaylist,
              })
            }
            close={closeModal}
          />
        );
    }
  };

  return (
    <>
      <PlaylistMenuPopupContent>
        <CopyLinkMenuItem />
        <button onClick={() => openModal("edit")}>
          <PencilIcon />
          <span>Edit</span>
        </button>

        <button onClick={() => openModal("delete")}>
          <TrashIcon />
          <span>Delete</span>
        </button>
      </PlaylistMenuPopupContent>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
