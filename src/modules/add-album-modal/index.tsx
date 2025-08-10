import {
  Image,
  Input,
  Label,
  LoadingOverlay,
  ModalHeader,
  ModalRef,
} from "@/components";
import AddAlbumProvider, { useAddAlbumContext } from "./AddAlbumContext";
import useAddAlbumModal from "./_hooks/useAddAlbumModal";
import { ChangeEvent, RefObject, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button, Frame } from "@/pages/dashboard/_components";
import AlbumSingerSelect from "./_components/SingerSelect";

import { CheckIcon } from "@heroicons/react/20/solid";

type BaseProps = {
  className?: string;
  modalRef: RefObject<ModalRef>;
};

type Add = {
  variant: "add";
  user: User;
  singer?: Singer;
  afterSubmit: (album: Playlist) => void;
};

type Edit = {
  variant: "edit";
  album: Playlist;
  afterSubmit: (album: PlaylistSchema) => void;
};

type Props = (Add | Edit) & BaseProps;

function Content({ className = "", ...props }: Props) {
  const { albumData, setImageFile, updateAlbumData } = useAddAlbumContext();
  const { submit, isFetching, isValidToSubmit } = useAddAlbumModal(props);

  const labelRef = useRef<HTMLLabelElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  const saveButton = (
    <Button
      size={"clear"}
      className="py-1.5 px-3"
      onClick={submit}
      loading={isFetching}
      disabled={!isValidToSubmit || isFetching}
    >
      <CheckIcon className="w-6" />
      <span>Save</span>
    </Button>
  );

  if (!albumData) return <></>;

  return (
    <>
      <ModalHeader
        closeModal={() => props.modalRef.current?.close()}
        title={props.variant === 'add' ? "Add album" : "Edit albm"}
      />

      <div className={`md:flex ${className} overflow-auto`}>
        <div className="space-y-3">
          <Frame
            p={"clear"}
            className="w-[200px] mx-auto h-[200px] rounded-lg overflow-hidden"
          >
            <Image
              className="object-cover object-center h-full"
              blurHashEncode={albumData.blurhash_encode}
              src={albumData.image_url}
            />
          </Frame>

          <label ref={labelRef} htmlFor="image_upload"></label>
          <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/png, image/jpeg"
            id="image_upload"
            className="hidden"
          />

          <Button color={"primary"} size={"clear"}>
            <label
              htmlFor="image_upload"
              className={`md:px-3 p-1.5 inline-flex space-x-1 cursor-pointer `}
            >
              <PhotoIcon className="w-6" />
            </label>
          </Button>
        </div>

        <div className="md:w-3/4 mt-5 md:mt-0 md:ml-5 flex-grow flex flex-col space-y-5">
          <>
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                placeholder="name..."
                id="name"
                className="text-[#333]"
                value={albumData.name}
                onChange={(e) => updateAlbumData({ name: e.target.value })}
              />
            </div>

            <AlbumSingerSelect />
          </>
        </div>
      </div>

      <p className="text-right mt-3">{saveButton}</p>

      {isFetching && <LoadingOverlay />}
    </>
  );
}

export default function AddAlbumModal(props: Props) {
  return (
    <AddAlbumProvider>
      <Content {...props} />
    </AddAlbumProvider>
  );
}
