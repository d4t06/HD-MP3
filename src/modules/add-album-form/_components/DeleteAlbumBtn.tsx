import { ConfirmModal, Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAddAlbumContext } from "./AddAlbumContext";
import { deleteFile, myDeleteDoc } from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useToastContext } from "@/stores";

export default function DeleteAlbumBtn() {
  const { album } = useAddAlbumContext();

  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const modalRef = useRef<ModalRef>(null);

  const navigator = useNavigate();

  const handleDeleteAlbum = async () => {
    try {
      if (!album) return;

      setIsFetching(true);

      deleteFile({ fileId: album.image_file_id });
      await myDeleteDoc({
        collectionName: "Playlists",
        id: album.id,
      });

      setSuccessToast("Delete Album successful");
      navigator("/dashboard/album");
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
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
          loading={isFetching}
        />
      </Modal>
    </>
  );
}
