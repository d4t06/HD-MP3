import { Modal, ModalRef } from "@/components";
import AddAlbumForm from "@/modules/add-album-form";
import { useAddAlbumContext } from "@/modules/add-album-form/_components/AddAlbumContext";
import { Button } from "@/pages/dashboard/_components";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function EditAlbumBtn() {
  const { album } = useAddAlbumContext();
  const modalRef = useRef<ModalRef>(null);

  if (!album) return;

  return (
    <>
      <Button onClick={() => modalRef.current?.open()}>
        <PencilIcon className="w-6" />
        <span>Edit</span>
      </Button>

      <Modal variant="animation" ref={modalRef}>
        <AddAlbumForm variant="edit" album={album} />
      </Modal>
    </>
  );
}
