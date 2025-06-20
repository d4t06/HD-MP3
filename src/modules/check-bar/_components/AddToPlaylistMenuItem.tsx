import { Modal, ModalContentWrapper, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { usePopoverContext } from "@/components/MyPopup";
import { RefObject } from "react";
import { useAuthContext, useSongSelectContext } from "@/stores";
import AddPlaylistModal from "@/modules/add-playlist-form";
import useMyMusicAddPlaylist from "@/pages/my-music/_hooks/useAddPlaylist";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export function AddSelectSongsToPlaylistMenuModal({
  modalRef,
}: {
  modalRef: RefObject<ModalRef>;
}) {
  const { user } = useAuthContext();

  const { selectedSongs } = useSongSelectContext();

  const { myMusicAddPlaylist, isFetching } = useMyMusicAddPlaylist();

  const handleAddSongToNewPlaylist = async (
    playlist: PlaylistSchema,
    imageFile?: File,
  ) => {
    playlist.song_ids = selectedSongs.map((s) => s.id);

    await myMusicAddPlaylist(playlist, imageFile);

    modalRef.current?.close();
  };

  if (!user) return <></>;

  return (
    <Modal variant="animation" ref={modalRef}>
      <ModalContentWrapper className="w-[600px]">
        <AddPlaylistModal
          close={() => modalRef.current?.close()}
          submit={handleAddSongToNewPlaylist}
          isLoading={isFetching}
          variant="add"
          user={user}
        />
      </ModalContentWrapper>
    </Modal>
  );
}

export default function AddToPlaylistMenuItem({ modalRef }: Props) {
  const { user } = useAuthContext();
  const { close } = usePopoverContext();

  const handleOpenModal = () => {
    modalRef.current?.open();
    close();
  };

  if (!user) return <></>;

  return (
    <button onClick={handleOpenModal}>
      <PlusIcon className="w-5" />
      <span>Add to playlist</span>
    </button>
  );
}
