import { MouseEventHandler, RefObject, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

import {
  Image,
  Button,
  ModalHeader,
  ModalRef,
  Input,
  ModalContentWrapper,
  Label,
  LoadingOverlay,
  Modal,
  ChooseImageModal,
} from "@/components";
import useEditSongModal from "./_hooks/useEditSongModal";

type Props = {
  song: Song;
  modalRef: RefObject<ModalRef>;
};

export default function EditSongModal({ song, modalRef }: Props) {
  const localModalRef = useRef<ModalRef>(null);
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

  const handleImageFile = (file: File) => {
    setImageFile(file);
    handleInput("image_url", URL.createObjectURL(file));
  };

  const handleCloseEditForm: MouseEventHandler = (e) => {
    e.stopPropagation();
    modalRef.current?.close();
  };

  return (
    <>
      <ModalContentWrapper className={`w-[500px]`}>
        <ModalHeader
          title="Edit song"
          closeModal={() => modalRef.current?.close()}
        />

        <div className="flex flex-col flex-grow overflow-auto md:overflow-hidden md:flex-row mt-5">
          <div className="space-y-2.5">
            <div className="w-[200px] rounded-md overflow-hidden h-[200px] md:w-[160px] md:h-[160px] object-cover">
              <Image className="object-cover h-full" src={songData.image_url} />
            </div>

            <Button onClick={() => localModalRef.current?.open()} color="primary">
              <PhotoIcon className="w-5" />
            </Button>
          </div>

          <div className="pt-5 md:pt-0 md:pl-5 md:flex-grow space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                value={songData.name}
                type="text"
                id="name"
                onChange={(e) => handleInput("name", e.target.value)}
                placeholder={song.name}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="singer">Singer</Label>
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
          <Button onClick={handleCloseEditForm} className={`rounded-full`}>
            Close
          </Button>

          <Button
            isLoading={isFetching}
            onClick={handleSubmit}
            disabled={!isValidToSubmit}
            className={` rounded-full`}
            variant={"primary"}
            color="primary"
          >
            Save
          </Button>
        </div>

        {isFetching && <LoadingOverlay />}
      </ModalContentWrapper>

      <Modal variant="animation" ref={localModalRef}>
        <ChooseImageModal
          setImageFile={handleImageFile}
          modalRef={localModalRef}
          title="Song image"
        />
      </Modal>
    </>
  );
}
