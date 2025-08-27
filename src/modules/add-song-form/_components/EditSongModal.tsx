import {
  Image,
  Input,
  Label,
  ModalContentWrapper,
  ModalHeader,
  RatioFrame,
} from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { getBlurHashEncode } from "@/services/imageService";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";

type Props = {
  closeModal: () => void;
};

export default function EditSongModal({ closeModal }: Props) {
  const { songData, updateSongData } = useAddSongContext();

  const [isFetching, setIsFetching] = useState(false);

  const [localSongData, setLocalSongData] = useState<Partial<Song>>({
    name: "",
    release_year: 0,
    blurhash_encode: "",
  });

  const updateLocalSongData = (data: Partial<typeof localSongData>) => {
    setLocalSongData((prev) => ({ ...prev, ...data }));
  };

  const _updateSongData = () => {
    if (!localSongData.name || !localSongData.release_year) return;

    updateSongData(localSongData);
    closeModal();
  };

  const updateBlurhash = async () => {
    if (!songData?.image_url) return;

    try {
      setIsFetching(true);

      const response = await fetch(songData.image_url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const imageBlob = await response.blob();

      const res = await getBlurHashEncode(imageBlob);

      updateLocalSongData({ blurhash_encode: res.encode });
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (songData) {
      setLocalSongData({
        name: songData.name,
        release_year: songData.release_year,
        blurhash_encode: songData.blurhash_encode,
      });
    }
  }, [songData]);

  return (
    <ModalContentWrapper className="w-[500px]">
      <ModalHeader title="Edit song" closeModal={closeModal} />

      <div className="md:flex overflow-auto">
        <div className="flex-shrink-0 flex md:block md:w-[160px] [&>div]:p-2">
          <div className="w-full">
            <Image className="rounded-md" src={songData?.image_url} />
          </div>

          {localSongData.blurhash_encode && (
            <div className="w-full">
              <RatioFrame className="pt-[100%]">
                <Blurhash
                  hash={localSongData.blurhash_encode}
                  className={`overflow-hidden rounded-md`}
                  height={"100%"}
                  width={"100%"}
                />
              </RatioFrame>
            </div>
          )}
        </div>

        <div className="space-y-3 mt-5 md:mt-0 w-full">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={localSongData?.name}
              onChange={(e) => updateLocalSongData({ name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label>Release year</Label>
            <Input
              type="number"
              value={localSongData.release_year + "" || "0"}
              onChange={(e) =>
                updateLocalSongData({
                  release_year: +e.target.value || 0,
                })
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Blurhash</Label>
            <Input type="text" readOnly value={localSongData.blurhash_encode} />

            <Button
              disabled={isFetching}
              onClick={updateBlurhash}
              className="p-1.5 text-sm"
              size={"clear"}
            >
              <ArrowPathIcon className="w-5" />
              <span>Update</span>
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-right">
        <Button onClick={_updateSongData}>Ok</Button>
      </p>
    </ModalContentWrapper>
  );
}
