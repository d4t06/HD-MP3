import { Image } from "@/components";
import AddAlbumProvider, { useAddAlbumContext } from "./_components/AddAlbumContext";
import useAddAlbum from "./_hooks/useAddAlbum";
import { ChangeEvent } from "react";
import { useThemeContext } from "@/stores";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "@/pages/dashboard/_components";
import AlbumSingerSelect from "./_components/SingerSelect";
import AlbumSongSelect from "./_components/SongSelect";
import DeleteAlbumBtn from "./_components/DeleteAlbumBtn";
import ButtonCtaFrame from "@/pages/dashboard/_components/ui/buttonCtaFrame";

type BaseProps = {
  className?: string;
};

type Add = {
  variant: "add";
  user: User;
  singer?: Singer;
  callback: (album: Playlist) => void;
};

type Edit = {
  variant: "edit";
  album: Playlist;
};

type Props = (Add | Edit) & BaseProps;

function Content({ className = "", ...props }: Props) {
  const { theme } = useThemeContext();

  const { albumData, setImageFile } = useAddAlbumContext();
  const { submit, isFetching, isValidToSubmit } = useAddAlbum(props);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  if (!albumData) return <></>;

  return (
    <>
      <div className={`md:flex ${className}`}>
        <div className="space-y-2.5">
          <div className="w-[200px] mx-auto h-[200px] rounded-lg overflow-hidden">
            <Image
              className="object-cover object-center h-full"
              blurHashEncode={albumData.blurhash_encode}
              src={albumData.image_url}
            />
          </div>
          <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/png, image/jpeg"
            id="image_upload"
            className="hidden"
          />

          <div>
            <ButtonCtaFrame>
              <Button className={`${theme.content_bg} !p-0`} size={"clear"}>
                <label htmlFor="image_upload" className={`md:px-3 p-1.5 inline-flex space-x-1 cursor-pointer `}>
                  <PhotoIcon className="w-5" />

                  <span>Change image</span>
                </label>
              </Button>

              {props.variant === "edit" && <DeleteAlbumBtn />}
            </ButtonCtaFrame>
          </div>
        </div>

        <div className="mt-3 md:w-3/4 md:mt-0 md:ml-3 flex-grow flex flex-col space-y-2.5">
          <AlbumSingerSelect />
          <AlbumSongSelect />
        </div>
      </div>

      <p className="text-right mt-5">
        <Button
          loading={isFetching}
          color="primary"
          onClick={submit}
          disabled={!isValidToSubmit}
          className={`font-playwriteCU rounded-full`}
        >
          Save
        </Button>
      </p>
    </>
  );
}

export default function AddAlbumForm(props: Props) {
  return (
    <AddAlbumProvider>
      <Content {...props} />
    </AddAlbumProvider>
  );
}
