import { Modal, ModalRef, Button, ModalContentWrapper } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useAuthContext } from "@/stores";
import AddPlaylistModal from "@/modules/add-playlist-form";
import { useAddPlaylist } from "@/hooks";
// import { ContentWrapper } from "../../_components/ui/ModalWrapper";

export default function AddNewPlaylistBtn() {
  const { user } = useAuthContext();
  const { handleAddPlaylist, isFetching } = useAddPlaylist();
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  const _handleAddPlaylist = async (p: PlaylistSchema, imageFile?: File) => {
    // important !!!
    p.is_official = true;

    await handleAddPlaylist(p, imageFile);
    closeModal();
  };

  if (!user) return;

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className={`self-start p-1.5 ml-5`}
        size={"clear"}
        color="primary"
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add new playlist</div>
      </Button>

      <Modal ref={modalRef} variant="animation">
        <ModalContentWrapper className="w-[600px]">
          <AddPlaylistModal
            close={closeModal}
            isLoading={isFetching}
            variant="add"
            user={user}
            submit={_handleAddPlaylist}
          />
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
