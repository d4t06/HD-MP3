import { useEffect, ChangeEvent, useMemo } from "react";
import { useThemeContext } from "@/stores";
import { initPlaylistObject } from "@/utils/factory";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button, Image, Input, ModalHeader, Switch } from "@/components";
import useAddPlaylistForm from "./_hooks/useAddPlaylistForm";

type Props = {
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

export default function AddPlaylistModal({
  close,
  isLoading,
  submit,
  ...props
}: Props & (Add | Edit)) {
  const { theme } = useThemeContext();

  const {
    imageFile,
    setImageFile,
    playlistData,
    updatePlaylistData,
    setPlaylistData,
    inputRef,
  } = useAddPlaylistForm();

  const isChanged = useMemo(() => {
    if (props.variant === "add") return true;
    if (!props.playlist || !playlistData) return false;

    return (
      playlistData.name !== props.playlist.name ||
      playlistData.is_public !== props.playlist.is_public
    );
  }, [playlistData]);

  const isChangeImage = !!imageFile;

  const isValidToSubmit = useMemo(() => {
    const isValidPlaylistData = !!playlistData?.name && isChanged;

    return props.variant === "add"
      ? isValidPlaylistData
      : isValidPlaylistData || isChangeImage;
  }, [isChangeImage, isChanged, playlistData]);

  const initPlaylistData = () => {
    switch (props.variant) {
      case "add":
        return initPlaylistObject({
          distributor: props.user.display_name,
          owner_email: props.user.email,
        });
      case "edit":
        const { id, created_at, ...rest } = props.playlist;
        return initPlaylistObject(rest);
    }
  };

  const handleAddPlaylist = async () => {
    if (!playlistData) return;
    if (!isChanged && !isChangeImage) return;

    //  it must be change something here!!
    submit(playlistData, imageFile);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    if (props.variant === "add") inputRef.current?.focus();

    setPlaylistData(initPlaylistData());
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    updatePlaylistData({ image_url: URL.createObjectURL(imageFile) });
  }, [imageFile]);

  if (!playlistData) return;

  return (
    <div className="w-[500px] max-w-[calc(100vw-40px)]">
      <ModalHeader
        close={close}
        title={props.variant === "add" ? "Add playlist" : "Edit playlist"}
      />

      <div className="flex space-x-3">
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

        <div className="flex-grow flex flex-col space-y-2.5">
          <Input
            ref={inputRef}
            type="text"
            placeholder="name..."
            value={playlistData.name}
            onChange={(e) => updatePlaylistData({ name: e.target.value })}
          />

          <div className="flex items-center justify-between">
            <span>Public</span>

            <Switch
              className=""
              active={playlistData.is_public}
              cb={() => updatePlaylistData({ is_public: !playlistData.is_public })}
            />
          </div>

          <p className="text-right !mt-auto">
            <Button
              type="submit"
              isLoading={isLoading}
              variant={"primary"}
              onClick={handleAddPlaylist}
              disabled={!isValidToSubmit}
              className={`${theme.content_bg} font-playwriteCU rounded-full`}
            >
              Save
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
