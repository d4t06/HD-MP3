import { ChangeEvent, MouseEventHandler, RefObject, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

import { Image, Button, ModalHeader, ModalRef, Input, ModalContentWrapper } from "@/components";
import { useThemeContext } from "@/stores";
import { getDisable } from "@/utils/appHelpers";
import useEditSongModal from "./_hooks/useEditSongModal";

type Props = {
  song: Song;
  modalRef: RefObject<ModalRef>;
};

export default function EditSongModal({ song, modalRef }: Props) {
  const { theme } = useThemeContext();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // use hooks
  const {
    isValidToSubmit,
    songData,
    setImageFile,
    isFetching,
    handleSubmit,
    handleInput,
  } = useEditSongModal({
    song,
    modalRef,
  });

  const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setImageFile(files[0]);
    handleInput("image_url", URL.createObjectURL(files[0]));
  };

  const handleCloseEditForm: MouseEventHandler = (e) => {
    e.stopPropagation();
    modalRef.current?.close();
  };

  return (
    <ModalContentWrapper
      className={`${getDisable(
        isFetching
      )} w-[500px]`}
    >
      <input
        ref={inputFileRef}
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageFile}
        className="hidden"
      />

      <ModalHeader title="Edit song" closeModal={() => modalRef.current?.close()} />

      <div className="flex flex-col flex-grow overflow-auto md:overflow-hidden md:flex-row mt-5">
        <div className="space-y-2.5">
          <div className="w-[200px] rounded-md overflow-hidden h-[200px] md:w-[160px] md:h-[160px] object-cover">
            <Image className="object-cover h-full" src={songData.image_url} />
          </div>

          <label
            htmlFor="image-input"
            className={`inline-block cursor-pointer hover:brightness-90 px-[20px] py-[5px] ${theme.content_bg} rounded-full text-[14px]`}
          >
            <PhotoIcon className="w-5" />
          </label>
        </div>

        <div className="pt-5 md:pt-0 md:pl-5 md:flex-grow space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="name" className="">
              Name
            </label>
            <Input
              value={songData.name}
              type="text"
              id="name"
              onChange={(e) => handleInput("name", e.target.value)}
              placeholder={song.name}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="singer" className="">
              Singer
            </label>
            <Input
              value={songData.singer}
              onChange={(e) => handleInput("singer", e.target.value)}
              type="text"
              id="singer"
              placeholder={song.singers[0].name}
            />
          </div>
        </div>
      </div>
      <div className="flex mt-5 space-x-2 justify-end">
        <Button
          onClick={handleCloseEditForm}
          className={`rounded-full`}
        >
          Close
        </Button>

        <Button
          isLoading={isFetching}
          onClick={handleSubmit}
          disabled={!isValidToSubmit}
          className={`${theme.content_bg} rounded-full`}
          variant={"primary"}
        >
          Save
        </Button>
      </div>
    </ModalContentWrapper>
  );
}
