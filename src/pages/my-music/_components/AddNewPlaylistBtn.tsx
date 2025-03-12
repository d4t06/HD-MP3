import { Button, Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useAuthContext } from "@/stores";
import AddPlaylistModal from "@/modules/add-playlist-form";
import useMyMusicAddPlaylist from "../_hooks/useAddPlaylist";

export default function AddNewPlaylistBtn() {
  const { user } = useAuthContext();
  const { myMusicAddPlaylist, isFetching } = useMyMusicAddPlaylist();
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  const _handleAddPlaylist = async (p: PlaylistSchema, imageFile?: File) => {
    await myMusicAddPlaylist(p, imageFile);
    closeModal();
  };

  if (!user) return;

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        size={"clear"}
        className="py-1 px-4"
        color="primary"
      >
        <PlusIcon className="w-6" />
        <span>Add new playlist</span>
      </Button>

      <Modal ref={modalRef} variant="animation">
        <AddPlaylistModal
          close={closeModal}
          isLoading={isFetching}
          variant="add"
          user={user}
          submit={_handleAddPlaylist}
        />
      </Modal>
    </>
  );
}
