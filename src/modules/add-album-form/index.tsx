import { Image, Title } from "@/components";
import AddAlbumProvider, {
  useAddAlbumContext,
} from "./_components/AddAlbumContext";
import useAddAlbum from "./_hooks/useAddAlbum";
import { ChangeEvent, useMemo } from "react";
import { useThemeContext } from "@/stores";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button, Frame, ButtonCtaFrame } from "@/pages/dashboard/_components";
import AlbumSingerSelect from "./_components/SingerSelect";
import AlbumSongSelect from "./_components/SongSelect";
import DeleteAlbumBtn from "./_components/DeleteAlbumBtn";
import EditAlbumBtn from "./_components/EditAlbumBtn";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";
import DetailFrame from "@/pages/dashboard/_components/ui/DetailFrame";

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

  const { albumData, singer, setImageFile } = useAddAlbumContext();
  const { submit, isFetching, isValidToSubmit } = useAddAlbum(props);

  const lastUpdate = useMemo(() => albumData?.updated_at, [albumData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  const buttonList = (
    <>
      <ButtonCtaFrame>
        <Button className={`${theme.content_bg} !p-0`} size={"clear"}>
          <label
            htmlFor="image_upload"
            className={`md:px-3 p-1.5 inline-flex space-x-1 cursor-pointer `}
          >
            <PhotoIcon className="w-6" />

            <span>Change image</span>
          </label>
        </Button>

        {props.variant === "edit" && (
          <>
            <EditAlbumBtn />
            <DeleteAlbumBtn />
          </>
        )}
      </ButtonCtaFrame>

      <Button
        loading={isFetching}
        onClick={submit}
        disabled={!isValidToSubmit}
      >
        Save
      </Button>
    </>
  );

  if (!albumData) return <></>;

  return (
    <>
      <div className={`md:flex ${className}`}>
        <div className="space-y-3">
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

          {props.variant === "add" && <div>{buttonList}</div>}

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

        <div className="md:w-3/4 mt-5 md:mt-0 md:ml-3 flex-grow flex flex-col space-y-3">
          {props.variant === "add" && <AlbumSingerSelect />}

          <div>
            {props.variant === "add" && <p className="label mb-3">Songs</p>}
            {props.variant === "edit" && (
              <Title variant={"h3"} className="mb-3" title="Songs" />
            )}

            <AlbumSongSelect />
          </div>
        </div>
      </div>
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
