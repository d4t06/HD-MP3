import { Image, Input, Label, LoadingOverlay, Title } from "@/components";
import AddAlbumProvider, {
  useAddAlbumContext,
} from "./_components/AddAlbumContext";
import useAddAlbum from "./_hooks/useAddAlbum";
import { ChangeEvent, useMemo, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button, ButtonCtaFrame, Frame } from "@/pages/dashboard/_components";
import AlbumSingerSelect from "./_components/SingerSelect";
import AlbumSongSelect from "./_components/SongSelect";
import DeleteAlbumBtn from "./_components/DeleteAlbumBtn";
import EditAlbumBtn from "./_components/EditAlbumBtn";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";
import DetailFrame from "@/pages/dashboard/_components/ui/DetailFrame";
import { CheckIcon } from "@heroicons/react/20/solid";

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
  const { albumData, album, singer, setImageFile, updateAlbumData } =
    useAddAlbumContext();
  const { submit, isFetching, isValidToSubmit } = useAddAlbum(props);

  const labelRef = useRef<HTMLLabelElement>(null);

  const lastUpdate = useMemo(() => album?.updated_at, [album?.id]);

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

  const buttonList = (
    <>
      <ButtonCtaFrame>
        <Button onClick={() => labelRef.current?.click()}>
          <PhotoIcon className="w-6" />

          <span>Change image</span>
        </Button>

        {props.variant === "edit" && (
          <>
            <EditAlbumBtn />
            <DeleteAlbumBtn />
          </>
        )}
      </ButtonCtaFrame>

      {props.variant === "edit" && saveButton}
    </>
  );

  if (!albumData) return <></>;

  return (
    <>
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

          {props.variant === "add" && (
            <Button color={"primary"} size={"clear"}>
              <label
                htmlFor="image_upload"
                className={`md:px-3 p-1.5 inline-flex space-x-1 cursor-pointer `}
              >
                <PhotoIcon className="w-6" />

                <span>Change image</span>
              </label>
            </Button>
          )}

          {props.variant === "edit" && (
            <>
              <Title variant={"h2"} title={albumData.name} />

              <DetailFrame>
                <p>
                  <span>Singer:</span>
                  {singer?.name}
                </p>
                <p>
                  <span>Songs:</span>
                  {albumData.song_ids.length} songs
                </p>
                <p className="mt-1 font-[500]">
                  <span>Likes:</span>
                  {abbreviateNumber(albumData.like)}
                </p>

                <p>
                  <span>Last update:</span>
                  {dateFromTimestamp(lastUpdate)}
                </p>
              </DetailFrame>

              {buttonList}
            </>
          )}
        </div>

        <div className="md:w-3/4 mt-5 md:mt-0 md:ml-5 flex-grow flex flex-col space-y-5">
          {props.variant === "add" && (
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
          )}

          <div className="space-y-1">
            {props.variant === "add" && <Label>Songs</Label>}

            {props.variant === "edit" && (
              <Title variant={"h3"} className="mb-3" title="Songs" />
            )}

            <AlbumSongSelect />
          </div>
        </div>
      </div>

      {props.variant === "add" && (
        <p className="text-right mt-3">{saveButton}</p>
      )}

      {isFetching && <LoadingOverlay />}
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
