import { ConfirmModal, Modal, ModalRef } from "@/components";
import { TriggerRef, usePopoverContext } from "@/components/MyPopup";
import { useToastContext } from "@/stores";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { LinkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import usePlaylistAction from "../_hooks/usePlaylistAction";
import AddPlaylistModal from "@/modules/add-playlist-form";
import { PlaylistMenuPopupContent } from "./PlaylistMenuBtn";

type Modal = "edit" | "delete";

export default function OwnPlaylistMenu() {
  const { setSuccessToast } = useToastContext();
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);
  const { close } = usePopoverContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = usePlaylistAction();

  const openModal = (m: Modal) => {
    setModal(m);

    close();
    modalRef.current?.open();
  };
  const closeModal = () => modalRef.current?.close();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(location.href);
    setSuccessToast("Link copied");

    close();
  };

  const handleEditPlaylist = async (playlist: PlaylistSchema, imageFile?: File) => {
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
          <AddPlaylistModal
            isLoading={isFetching}
            playlist={currentPlaylist}
            submit={handleEditPlaylist}
            variant="edit"
            close={closeModal}
          />
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
        <button onClick={handleCopyLink}>
          <LinkIcon className="w-5" />
          <span>Copy link</span>
        </button>
        <button onClick={() => openModal("edit")}>
          <PencilIcon className="w-5" />
          <span>Edit</span>
        </button>

        <button onClick={() => openModal("delete")}>
          <TrashIcon className="w-5" />
          <span>Delete</span>
        </button>
      </PlaylistMenuPopupContent>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
