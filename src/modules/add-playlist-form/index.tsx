import { ChangeEvent } from "react";
import { useThemeContext } from "@/stores";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button, Image, Input, ModalHeader, Switch } from "@/components";
import useAddPlaylistForm from "./_hooks/useAddPlaylistForm";

type BaseProps = {
  close: () => void;
  submit: (p: PlaylistSchema, imageFile?: File) => void;
  isLoading: boolean;
};

type Add = {
  variant: "add";
  user: User;
};

type Edit = {
  variant: "edit";
  playlist: Playlist;
};

export type PlaylistModalVariantProps = Add | Edit;

export default function AddPlaylistModal({
  close,
  isLoading,
  submit,
  ...props
}: BaseProps & PlaylistModalVariantProps) {
  const { theme } = useThemeContext();

  const {
    imageFile,
    setImageFile,
    playlistData,
    updatePlaylistData,
    isChanged,
    isChangeImage,
    inputRef,
    isValidToSubmit,
  } = useAddPlaylistForm(props);

  const handleAddPlaylist = async () => {
    if (!playlistData) return;
    if (!isChanged && !isChangeImage) return;

    //  it must be change something here!!
    submit(playlistData, imageFile);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  if (!playlistData) return;

  return (
    <>
      <ModalHeader
        close={close}
        title={props.variant === "add" ? "Add playlist" : "Edit playlist"}
      />

      <div className="md:flex md:space-x-3">
        <div className="space-y-2.5">
          <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
            <Image
              className="object-cover object-center h-full"
              blurHashEncode={playlistData.blurhash_encode}
              src={playlistData.image_url}
            />
          </div>
          <input
            ref={inputRef}
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/png, image/jpeg"
            id="image_upload"
            className="hidden"
          />

          <div className="space-x-2 flex">
            <Button className={`${theme.content_bg}`} size={"clear"}>
              <label htmlFor="image_upload" className={`px-5 py-1 cursor-pointer `}>
                <PhotoIcon className="w-5" />
              </label>
            </Button>
          </div>
        </div>

        <div className="mt-3 md:mt-0 flex-grow flex flex-col space-y-2.5">
          <div>
            <label htmlFor="name">Name</label>

            <Input
              id="name"
              ref={inputRef}
              type="text"
              placeholder="name..."
              value={playlistData.name}
              onChange={(e) => updatePlaylistData({ name: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Public</span>

            <Switch
              inActiveBg="bg-black/10"
              active={playlistData.is_public}
              cb={() => updatePlaylistData({ is_public: !playlistData.is_public })}
            />
          </div>
        </div>
      </div>
      <p className="text-right mt-5 md:mt-0">
        <Button
          isLoading={isLoading}
          color="primary"
          onClick={handleAddPlaylist}
          disabled={!isValidToSubmit}
          className={`font-playwriteCU rounded-full`}
        >
          Save
        </Button>
      </p>
    </>
  );
}
