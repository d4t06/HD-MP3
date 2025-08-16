import { RefObject, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ChooseImageModal,
  Image,
  Input,
  Label,
  LoadingOverlay,
  Modal,
  ModalHeader,
  ModalRef,
  Switch,
} from "@/components";
import useAddPlaylistModal from "./_hooks/useAddPlaylistModal";

type BaseProps = {
  submit: (p: PlaylistSchema, imageFile?: File) => void;
  isLoading: boolean;
};

type Add = {
  variant: "add";
  user: User;
  name?: string;
};

type Edit = {
  variant: "edit";
  playlist: Playlist;
};

export type PlaylistModalVariantProps = (Add | Edit) & {
  modalRef: RefObject<ModalRef>;
};

export default function AddPlaylistModal({
  isLoading,
  submit,
  ...props
}: BaseProps & PlaylistModalVariantProps) {
  const {
    imageFile,
    setImageFile,
    playlistData,
    updatePlaylistData,
    isChanged,
    isChangeImage,
    inputRef,
    isValidToSubmit,
  } = useAddPlaylistModal(props);

  const modalRef = useRef<ModalRef>(null);

  const handleAddPlaylist = async () => {
    if (!playlistData) return;
    if (!isChanged && !isChangeImage) return;

    //  it must be change something here!!
    submit(playlistData, imageFile);
  };

  if (!playlistData) return <></>;

  return (
    <>
      <ModalHeader
        closeModal={() => props.modalRef.current?.close()}
        title={props.variant === "add" ? "Add playlist" : "Edit playlist"}
      />

      <div className="md:flex md:space-x-3 overflow-auto">
        <div className="space-y-2.5">
          <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
            <Image
              className="object-cover object-center h-full"
              blurHashEncode={playlistData.blurhash_encode}
              src={playlistData.image_url}
            />
          </div>

          <p className="">
            <Button onClick={() => modalRef.current?.open()} color="primary">
              <PhotoIcon className="w-5" />
              <span>Change image</span>
            </Button>
          </p>
        </div>

        <div className="mt-3 md:mt-0 flex-grow flex flex-col space-y-2.5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              ref={inputRef}
              type="text"
              placeholder="name..."
              value={playlistData.name || ""}
              onChange={(e) => updatePlaylistData({ name: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Public</Label>

            <Switch
              inActiveBg="bg-black/10"
              active={playlistData.is_public}
              cb={() =>
                updatePlaylistData({ is_public: !playlistData.is_public })
              }
            />
          </div>
        </div>
      </div>
      <p className="text-right mt-5 md:mt-0">
        <Button
          color="primary"
          onClick={handleAddPlaylist}
          disabled={!isValidToSubmit || isLoading}
          className={`font-playwriteCU rounded-full`}
        >
          Save
        </Button>
      </p>

      {isLoading && <LoadingOverlay />}

      <Modal variant="animation" ref={modalRef}>
        <ChooseImageModal
          modalRef={modalRef}
          setImageFile={setImageFile}
          title="Playlist image"
        />
      </Modal>
    </>
  );
}
