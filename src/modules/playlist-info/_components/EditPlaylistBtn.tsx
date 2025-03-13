import { Button, ConfirmModal, Modal, ModalRef } from "@/components";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  TriggerRef,
} from "@/components/MyPopup";
import { useThemeContext, useToastContext } from "@/stores";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  AdjustmentsHorizontalIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { MenuList, MenuWrapper } from "@/components/ui/MenuWrapper";
import usePlaylistAction from "../_hooks/usePlaylistAction";
import AddPlaylistModal from "@/modules/add-playlist-form";

type Modal = "edit" | "delete";

export default function EditPlaylistBtn() {
  const { theme } = useThemeContext();
  const { setSuccessToast } = useToastContext();
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  const [modal, setModal] = useState<Modal | "">("");
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);

  const modalRef = useRef<ModalRef>(null);
  const triggerRef = useRef<TriggerRef>(null);

  const { action, isFetching } = usePlaylistAction();

  const openModal = (m: Modal) => {
    setModal(m);

    triggerRef.current?.close();
    modalRef.current?.open();
  };
  const closeModal = () => modalRef.current?.close();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(location.href);
    setSuccessToast("Link copied");

    triggerRef.current?.close();
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
      <MyPopup>
        <MyPopupTrigger setIsOpenParent={setIsOpenPopup} ref={triggerRef}>
          <Button
            size={"clear"}
            className={`rounded-full p-2.5 ${isOpenPopup ? theme.content_bg : ""} ${
              theme.content_hover_bg
            } bg-${theme.alpha}`}
          >
            <AdjustmentsHorizontalIcon className="w-6" />
          </Button>
        </MyPopupTrigger>

        <MyPopupContent
          className="left-[calc(100%)] bottom-full w-[120px]"
          animationClassName="origin-top-left"
          appendTo="parent"
        >
          <MenuWrapper>
            <MenuList>
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
            </MenuList>
          </MenuWrapper>
        </MyPopupContent>
      </MyPopup>
      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
