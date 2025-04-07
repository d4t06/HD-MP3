import { ModalRef } from "@/components";
import { Button, DashboardModal } from "@/pages/dashboard/_components";
import { ContentWrapper } from "@/pages/dashboard/_components/ui/ModalWrapper";
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
          className={`inline-flex p-1 space-x-1 cursor-pointer md:px-3`}
        >
          <PhotoIcon className="w-6" />
          <span className="hidden md:block">Change image</span>
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
          className="p-1 justify-center md:px-3"
          size={"clear"}
        >
          <QuestionMarkCircleIcon className="w-6" />
          <span className="hidden md:block">Image info</span>
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
        <DashboardModal variant="animation" ref={modalRef} wrapped={false}>
          <ContentWrapper>
            <p>Url: {songData?.image_url}</p>
            <p>Hash: {songData?.blurhash_encode}</p>
          </ContentWrapper>
        </DashboardModal>
      )}
    </>
  );
}
