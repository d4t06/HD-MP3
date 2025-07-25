import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAddAlbumContext } from "./AddAlbumContext";
import { deleteFile, myDeleteDoc } from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function DeleteAlbumBtn() {
  const { album } = useAddAlbumContext();

  const modalRef = useRef<ModalRef>(null);

  const navigator = useNavigate();

  const handleDeleteAlbum = async () => {
    try {
      if (!album) return;

      await Promise.all([
        myDeleteDoc({
          collectionName: "Playlists",
          id: album.id,
        }),
        album.image_file_id
          ? deleteFile({ fileId: album.image_file_id })
          : () => {},
      ]);

      navigator("/dashboard/album");
    } catch {}
  };

  return (
    <>
      <Button size={"clear"} onClick={() => modalRef.current?.open()}>
        <TrashIcon className="w-6" />
        <span>Delete</span>
      </Button>

      <Modal variant="animation" ref={modalRef}>
        <ConfirmModal
          label={`Delete album ' ${album?.name} '`}
          closeModal={() => modalRef.current?.close()}
          callback={handleDeleteAlbum}
          loading={false}
        />
      </Modal>
    </>
  );
}
