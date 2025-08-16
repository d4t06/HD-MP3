import { ChooseImageModal, Modal, ModalRef } from "@/components";
import { useReadCopiedImage } from "@/hooks";
import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef } from "react";

export default function UploadImageBtn() {
  const { setImageFile, songData, updateSongData, imageBlob, setImageBlob } =
    useAddSongContext();

  const modalRef = useRef<ModalRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useReadCopiedImage({
    setImageFileFromParent: setImageFile,
    modalRef,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    if (!songData) return;

    setImageBlob(undefined);
    URL.revokeObjectURL(songData.image_url);

    updateSongData({ image_url: "" });
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

      <input
        ref={inputRef}
        onChange={handleInputChange}
        type="file"
        multiple
        accept="image/png, image/jpeg"
        id="image_upload"
        className="hidden"
      />

      <Modal variant="animation" ref={modalRef}>
        <ChooseImageModal
          modalRef={modalRef}
          setImageFile={setImageFile}
          title="Song image"
        />
      </Modal>
    </>
  );
}
