import { Modal, ModalRef } from "@/components";
import { Button, ModalWrapper } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { PhotoIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef } from "react";

export default function UploadImageBtn() {
  const { setImageFile, songData } = useAddSongContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<ModalRef>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  return (
    <>
      <input
        ref={inputRef}
        onChange={handleInputChange}
        type="file"
        multiple
        accept="audio"
        id="image_upload"
        className="hidden"
      />

      <div className="space-x-2 flex">
        <Button className="" size={"clear"}>
          <label
            htmlFor="image_upload"
            className={`inline-flex py-1.5 space-x-1 cursor-pointer px-5 `}
          >
            <PhotoIcon className="w-6" />
          </label>
        </Button>

        {songData?.image_url && (
          <Button onClick={() => modalRef.current?.open()} className="h-[36px] justify-center w-[36px]" size={"clear"}>
            <QuestionMarkCircleIcon className="w-6" />
          </Button>
        )}
      </div>

      {songData?.image_url && (
        <Modal  variant="animation" ref={modalRef}>
          <ModalWrapper className="w-[500px] space-y-2.5">
            <p>{songData?.image_url}</p>
            <p>{songData?.blurhash_encode}</p>
          </ModalWrapper>
        </Modal>
      )}
    </>
  );
}
