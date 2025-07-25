import { ConfirmModal, Modal, ModalRef } from "@/components";
import { useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import ItemRightCtaFrame from "../../_components/ui/ItemRightCtaFrame";
import { Link } from "react-router-dom";
import UsePlaylistSectionAction from "../hooks/usePlaylistSectionAction";

type Props = {
  playlist: Playlist;
  sectionIndex: number;
};

type Modal = "edit" | "delete";

export default function PlaylistItem({ playlist, sectionIndex }: Props) {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = UsePlaylistSectionAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);

    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <ItemRightCtaFrame>
        <Link
          to={`/dashboard/playlist/${playlist.id}`}
          className="hover:underline"
        >
          {playlist.name}
        </Link>

        <div>
          <button onClick={() => openModal("delete")}>
            <TrashIcon className="w-5" />
          </button>
        </div>
      </ItemRightCtaFrame>

      <Modal variant="animation" ref={modalRef}>
        {modal === "delete" && (
          <ConfirmModal
            callback={() =>
              action({
                variant: "remove-playlist",
                id: playlist.id,
                sectionIndex,
              })
            }
            closeModal={closeModal}
            loading={isFetching}
            label={`Remove playlist '${playlist.name}'`}
          />
        )}
      </Modal>
    </>
  );
}
