import { ElementRef, useEffect, useRef } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { initSongObject } from "@/utils/factory";
import UploadSongBtn from "./_components/UploadSongBtn";
import { Center, Empty, Input, Modal, NotFound } from "@/components";
import SingerSelect from "./_components/SingerSelect";
import { Button } from "@/components/dashboard";
import AudioPLayer from "./_components/AudioPlayer";
import GenreSelect from "./_components/GenreSelect";
import useAddSongForm from "./_hooks/useAddSongForm";
import FinishedModal from "./_components/FinishedModal";

type Add = {
  variant: "add";
  ownerEmail: string;
};

type Edit = {
  variant: "edit";
  song: Song;
};

type Props = Add | Edit;

const initSongData = (props: Props) => {
  switch (props.variant) {
    case "add":
      return initSongObject({
        owner_email: props.ownerEmail,
      });
    case "edit":
      const { id, ...rest } = props.song;
      return initSongObject(rest);
  }
};

export default function AddSongForm(props: Add | Edit) {
  const {
    isFetching,
    handleSubmit,
    setSongData,
    updateSongData,
    songData,
    genres,
    singers,
    songFile,
    ableToSubmit,
    setAbleToSubmit,
    modalRef,
    handleCloseModalAfterFinished,
  } = useAddSongForm();

  const audioRef = useRef<ElementRef<"audio">>(null);

  useEffect(() => {
    if (props.variant === "add")
      setAbleToSubmit(
        !!songFile && !!genres.length && !!singers.length && !!songData?.name
      );

    if (props.variant === "edit")
      setAbleToSubmit(!!genres.length && !!singers.length && !!songData?.name);
  }, [props.variant, songFile, genres, singers]);

  useEffect(() => {
    setSongData(initSongData(props));
  }, []);

  if (props.variant === "add" && !songFile)
    return (
      <Center>
        <UploadSongBtn />
      </Center>
    );

  if (!songData?.name) return <NotFound className="h-full" />;

  return (
    <div className="w-full md:max-w-[800px] md:mx-auto">
      <audio
        ref={audioRef}
        src={
          props.variant === "add"
            ? URL.createObjectURL(songFile as File)
            : songData.song_url
        }
        className="hidden"
      />

      <div className="md:flex md:space-x-5">
        <div className="">
          <div className="w-[200px] h-[200px]">
            <Empty />
          </div>
        </div>

        <div className="space-y-3 flex-grow">
          {audioRef.current && <AudioPLayer audioEle={audioRef.current} />}

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
        <Button onClick={handleSubmit} disabled={!ableToSubmit} loading={isFetching}>
          <CheckIcon className="w-6" />
          <span>Ok</span>
        </Button>
      </p>

      <Modal persisted ref={modalRef} wrapped={false} variant="animation">
        <FinishedModal handleCloseModal={handleCloseModalAfterFinished} />
      </Modal>
    </div>
  );
}
