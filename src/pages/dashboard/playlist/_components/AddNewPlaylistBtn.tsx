import { Modal, ModalRef, ModalContentWrapper } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { useAuthContext } from "@/stores";
import AddPlaylistModal from "@/modules/add-playlist-modal";
import { useAddPlaylist } from "@/hooks";
import { Button } from "../../_components";
import { usePlaylistsContext } from "@/stores/dashboard/PlaylistContext";

export default function AddNewPlaylistBtn() {
  const { user } = useAuthContext();
  const { setPlaylists } = usePlaylistsContext();
  const { addPlaylist, isFetching } = useAddPlaylist();
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  const _handleAddPlaylist = async (p: PlaylistSchema, imageFile?: File) => {
    // important !!!
    p.is_official = true;

    const newPlaylist = await addPlaylist(
      {
        variant: "add",
        playlist: p,
        imageFile,
      },
      { push: false },
    );

    if (newPlaylist) {
      setPlaylists((prev) => [newPlaylist as Playlist, ...prev]);
    }

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
            modalRef={modalRef}
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
