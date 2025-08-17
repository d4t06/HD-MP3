import { ChooseImageModal, Modal, ModalRef } from "@/components";
import { useReadCopiedImage } from "@/hooks";
import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function UploadImageBtn() {
  const { setImageFile, songData, updateSongData, imageBlob, setImageBlob } =
    useAddSongContext();

  const modalRef = useRef<ModalRef>(null);

  useReadCopiedImage({
    setImageFileFromParent: setImageFile,
    modalRef,
  });

  const handleRemoveImage = () => {
    if (!songData) return;

    setImageBlob(undefined);
    URL.revokeObjectURL(songData.image_url);

    updateSongData({ image_url: "" });
  };

  const handleSetImageFile = (f: File) => {
    if (!songData) return;

    setImageBlob(undefined);
    URL.revokeObjectURL(songData.image_url);

    setImageFile(f);
  };

  return (
    <>
      <Button onClick={() => modalRef.current?.open()}>
        <PhotoIcon />
        <span>Change image</span>
      </Button>

      {imageBlob && (
        <Button onClick={handleRemoveImage} size={"clear"}>
          <XMarkIcon />
          <span>Discard image</span>
        </Button>
      )}

      <Modal variant="animation" ref={modalRef}>
        <ChooseImageModal
          modalRef={modalRef}
          setImageFile={handleSetImageFile}
          title="Song image"
        />
      </Modal>
    </>
  );
}
