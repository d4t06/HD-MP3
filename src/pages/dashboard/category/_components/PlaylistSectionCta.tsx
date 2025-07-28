import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { useRef, useState } from "react";
import { ArrangeModal, Modal, ModalRef } from "@/components";
import UsePlaylistSectionAction from "../hooks/usePlaylistSectionAction";
import AddPlaylistsModal from "../category-detail/_components/AddPlaylistsModal";

type Props = {
  sectionIndex: number;
  orderedPlaylists: Playlist[];
};

type Modal = "add" | "arrange";

export default function PlaylistSectionCta({
  sectionIndex,
  orderedPlaylists,
}: Props) {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = UsePlaylistSectionAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  return (
    <>
      <div className="flex space-x-2 justify-center mt-3">
        <Button onClick={() => openModal("add")}>
          <PlusIcon className="w-6" />
          <span>Add playlist </span>
        </Button>

        <Button
          onClick={() => openModal("arrange")}
          disabled={orderedPlaylists.length < 2}
        >
          <ArrowPathIcon className="w-6" />
          <span>Arrange</span>
        </Button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {modal === "add" && (
          <AddPlaylistsModal
            current={orderedPlaylists.map((p) => p.id)}
            closeModal={() => modalRef.current?.close()}
            isLoading={isFetching}
            submit={(playlists) =>
              action({ variant: "add-playlist", playlists, sectionIndex })
            }
          />
        )}

        {modal === "arrange" && (
          <ArrangeModal
            closeModal={() => modalRef.current?.close()}
            isLoading={isFetching}
            data={orderedPlaylists.map((p) => ({ id: p.id, label: p.name }))}
            submit={(order) =>
              action({
                variant: "arrange-playlist",
                section: { target_ids: order.join("_") },
                sectionIndex,
              })
            }
          />
        )}
      </Modal>
    </>
  );
}
