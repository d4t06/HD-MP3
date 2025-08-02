import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef } from "react";

export default function UploadImageBtn() {
  const { setImageFile, songData, updateSongData, imageBlob, setImageBlob } =
    useAddSongContext();

  const inputRef = useRef<HTMLInputElement>(null);

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
      <Button className="except" size={"clear"}>
        <label
          htmlFor="image_upload"
          className={`inline-flex p-1.5 space-x-1 md:px-3`}
        >
          <PhotoIcon />
          <span>Change image</span>
        </label>
      </Button>

      {imageBlob && (
        <Button onClick={handleRemoveImage} size={"clear"}>
          <XMarkIcon />
          <span>Discard image</span>
        </Button>
      )}

      {/*   {songData?.image_url && (
        <Button onClick={() => modalRef.current?.open()} size={"clear"}>
          <QuestionMarkCircleIcon />
          <span>Image info</span>
        </Button>
      )}*/}
      <input
        ref={inputRef}
        onChange={handleInputChange}
        type="file"
        multiple
        accept="image/png, image/jpeg"
        id="image_upload"
        className="hidden"
      />

      {/*  {songData?.image_url && (
        <Modal variant="animation" ref={modalRef}>
          <ModalContentWrapper>
            <p>Url: {songData?.image_url}</p>
            <p>Hash: {songData?.blurhash_encode}</p>
          </ModalContentWrapper>
        </Modal>
      )}*/}
    </>
  );
}
