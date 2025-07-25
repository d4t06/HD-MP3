import { CheckIcon } from "@heroicons/react/20/solid";
import { Center, Image, Modal } from "@/components";
import SingerSelect from "./_components/SingerSelect";
import AudioPLayer from "./_components/AudioPlayer";
import GenreSelect from "./_components/GenreSelect";
import useAddSongForm from "./_hooks/useAddSongForm";
import FinishedModal from "./_components/FinishedModal";
import {
  Button,
  ButtonCtaFrame,
  Frame,
  Loading,
} from "@/pages/dashboard/_components";
import ButtonGroup from "./_components/ButtonGroup";
import UploadSongBtn from "./_components/UploadSongBtn";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { getClasses } from "@/utils/appHelpers";
import useGetGenre from "@/pages/dashboard/genre/_hooks/useGetGenre";
import { useEffect } from "react";
import WeekSelect from "../week-select";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";
import PlayChart from "./_components/PlayChart";

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
    isValidToSubmit,
    modalRef,
    handleCloseModalAfterFinished,
  } = useAddSongForm(props);

  const { songFile, songData, audioRef } = useAddSongContext();

  const { api, isFetching: getGenreLoading } = useGetGenre();

  useEffect(() => {
    api();
  });

  return (
    <>
      {getGenreLoading ? (
        <Loading />
      ) : (
        <>
          {!songFile && props.variant === "add" && (
            <Center>
              <ButtonCtaFrame>
                <UploadSongBtn title="Upload song file" />
              </ButtonCtaFrame>
            </Center>
          )}
        </>
      )}

      <div
        className={`w-full md:max-w-[800px] md:mx-auto ${songData?.name ? "" : "hidden"}`}
      >
        <audio ref={audioRef} className="hidden" />

        <div
          className={`relative mt-5 md:flex md:space-x-5 ${getClasses(isFetching, "disable")}`}
        >
          <div className="flex flex-col items-center md:w-1/3 md:block space-y-2.5">
            <div className="max-w-[200px] w-full aspect-[1/1] bg-black/5 rounded-lg overflow-hidden">
              <Image
                className="object-cover h-full"
                blurHashEncode={songData?.blurhash_encode}
                src={songData?.image_url}
              />
            </div>

            <Frame className="space-y-2">
              <p>Total plays: {songData?.today_play}</p>
              <p>Likes: {songData?.like}</p>
              <p>Week plays: {songData?.week_play}</p>
              <p>Today plays: {songData?.today_play}</p>
              <p>Ranking: {songData?.last_week_rank}</p>
              <p className="text-sm">
                {/* Last listen: {dateFromTimestamp(songData?.last_active)} */}
              </p>
            </Frame>

            <div className="w-full">
              <ButtonGroup isEdit={props.variant === "edit"} />
            </div>
          </div>

          <div className="mt-5 md:mt-0 space-y-5 flex-grow">
            <PlayChart />

            <Frame>
              <div className="text-lg mb-3 font-bold text-[#333]">
                {songData?.name}
              </div>

              {audioRef.current && <AudioPLayer audioEle={audioRef.current} />}
            </Frame>

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
      </div>

      <Modal
        persisted={props.variant === "add" ? true : false}
        ref={modalRef}
        variant="animation"
      >
        <FinishedModal
          variant={props.variant}
          handleCloseModal={handleCloseModalAfterFinished}
        />
      </Modal>
    </>
  );
}
