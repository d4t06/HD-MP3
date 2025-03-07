import { Button, ConfirmModal, Modal, ModalRef } from "@/components";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  TriggerRef,
} from "@/components/MyPopup";
import usePlaylistAction from "@/hooks/usePlaylistAction";
import { useThemeContext } from "@/stores";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import EditPlaylist from "./EditPlaylistModal";
import {
  AdjustmentsHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { MenuWrapper } from "@/components/ui/MenuWrapper";

type Modal = "edit" | "delete";

export default function EditPlaylistBtn() {
  const { theme } = useThemeContext();

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

  const renderModal = () => {
    if (!currentPlaylist) return <></>;

    switch (modal) {
      case "":
        return <></>;
      case "edit":
        return <EditPlaylist close={closeModal} playlist={currentPlaylist} />;

      case "delete":
        return (
          <ConfirmModal
            loading={isFetching}
            label={`Delete playist ' ${currentPlaylist.name} ' ?`}
            callback={() =>
              action({
                variant: "delete",
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
          className="left-[calc(100%)]"
          animationClassName="origin-top-left"
          appendTo="parent"
        >
          <MenuWrapper>
            {/* <MenuList> */}
            <button onClick={() => openModal("edit")}>
              <PencilIcon className="w-5" />
              <span>Edit</span>
            </button>

            <button onClick={() => openModal("delete")}>
              <TrashIcon className="w-5" />
              <span>Delete</span>
            </button>
            {/* </MenuList> */}
          </MenuWrapper>
        </MyPopupContent>
      </MyPopup>
      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
