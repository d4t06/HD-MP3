import {
  ModalRef,
  Modal,
  ModalContentWrapper,
  ModalHeader,
} from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction, useRef } from "react";
import { useAuthContext } from "@/stores";
import { Button } from "../../_components";
import AddAlbumForm from "@/modules/add-album-form";

type Props = {
  setAlbums: Dispatch<SetStateAction<Playlist[]>>;
};

export default function AddNewAlbumBtn({ setAlbums }: Props) {
  const { user } = useAuthContext();
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  const handlePushAlbum = (album: Playlist) => {
    setAlbums((prev) => [album, ...prev]);
    closeModal();
  };

  if (!user) return;

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className={`self-start p-1.5 ml-5`}
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add new album</div>
      </Button>

      <Modal ref={modalRef} variant="animation">
        <ModalContentWrapper className="w-[800px]">
          <ModalHeader
            closeModal={() => modalRef.current?.close()}
            title="Add album"
          />
          <AddAlbumForm
            className="overflow-auto"
            variant="add"
            user={user}
            callback={handlePushAlbum}
          />
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
