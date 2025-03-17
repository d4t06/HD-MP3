import { ComponentType, ElementRef, useEffect, useRef } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { initSongObject } from "@/utils/factory";
import UploadSongBtn from "./_components/UploadSongBtn";
import { Center, Image, Input, Modal } from "@/components";
import SingerSelect from "./_components/SingerSelect";
import AudioPLayer from "./_components/AudioPlayer";
import GenreSelect from "./_components/GenreSelect";
import useAddSongForm from "./_hooks/useAddSongForm";
import FinishedModal from "./_components/FinishedModal";
import { Button } from "@/pages/dashboard/_components";
import UploadImageBtn from "./_components/UploadImageBtn";

type Add = {
  variant: "add";
  ownerEmail: string;
  distributor: string;
};

type Edit = {
  variant: "edit";
  song: Song;
};

type Props = Add | Edit;

export default function AddSongForm(props: Props) {
  const {
    isFetching,
    handleSubmit,
    updateSongData,
    songData,
    isValidToSubmit,
    songFile,
    modalRef,
    handleCloseModalAfterFinished,
  } = useAddSongForm(props);

  const audioRef = useRef<ElementRef<"audio">>(null);

  if (props.variant === "add" && !songFile)
    return (
      <Center>
        <UploadSongBtn />
      </Center>
    );

  return (
    <div className="w-full md:max-w-[800px] md:mx-auto">
      <audio
        ref={audioRef}
        src={
          props.variant === "add"
            ? URL.createObjectURL(songFile as File)
            : songData?.song_url || ""
        }
        className="hidden"
      />

      {songData && (
        <>
          <div className="md:flex md:space-x-5">
            <div className="flex flex-col items-center md:block space-y-2.5">
              <div className="w-[200px] h-[200px] bg-black/5 rounded-lg overflow-hidden">
                <Image
                  className="object-cover h-full"
                  blurHashEncode={songData.blurhash_encode}
                  src={songData.image_url}
                />
              </div>

              <UploadImageBtn />
            </div>

            <div className="mt-5 md:mt-0 space-y-3 flex-grow">
              {audioRef.current && (
                <AudioPLayer
                  variant={props.variant}
                  size={songData.size}
                  duration={songData.duration}
                  audioEle={audioRef.current}
                />
              )}

              <div className="space-y-1">
                <label>Song name</label>
                <Input
                  value={songData.name}
                  onChange={(e) => updateSongData({ name: e.target.value })}
                />
              </div>

              <SingerSelect />
              <GenreSelect />
            </div>
          </div>

          <p className="text-center mt-5">
            <Button
              onClick={handleSubmit}
              disabled={!isValidToSubmit}
              loading={isFetching}
            >
              <CheckIcon className="w-6" />
              <span>Ok</span>
            </Button>
          </p>

          <Modal
            persisted={props.variant === "add" ? true : false}
            ref={modalRef}
            wrapped={false}
            variant="animation"
          >
            <FinishedModal
              variant={props.variant}
              handleCloseModal={handleCloseModalAfterFinished}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
