import { Modal, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import {
  PhotoIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, useRef } from "react";

export default function UploadImageBtn() {
  const { setImageFile, songData, updateSongData, imageBlob, setImageBlob } =
    useAddSongContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<ModalRef>(null);

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
      <Button className="" size={"clear"}>
        <label
          htmlFor="image_upload"
          className={`inline-flex py-1.5 space-x-1 cursor-pointer px-5 `}
        >
          <PhotoIcon className="w-6" />
        </label>
      </Button>

      {imageBlob && (
        <Button
          onClick={handleRemoveImage}
          className="h-[36px] justify-center w-[36px]"
          size={"clear"}
        >
          <XMarkIcon className="w-6" />
        </Button>
      )}

      {songData?.image_url && (
        <Button
          onClick={() => modalRef.current?.open()}
          className="h-[36px] justify-center w-[36px]"
          size={"clear"}
        >
          <QuestionMarkCircleIcon className="w-6" />
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

      {songData?.image_url && (
        <Modal variant="animation" ref={modalRef}>
          <p>Url: {songData?.image_url}</p>
          <p>Hash: {songData?.blurhash_encode}</p>
        </Modal>
      )}
    </>
  );
}
