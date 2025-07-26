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
          <div className="flex flex-col items-center md:w-1/3 md:block space-y-3">
            <div className="max-w-[200px] w-full aspect-[1/1]  rounded-lg overflow-hidden">
              <Image
                className="object-cover h-full"
                blurHashEncode={songData?.blurhash_encode}
                src={songData?.image_url}
              />
            </div>

            <div className="text-xl font-bold text-[#333]">
              {songData?.name}
            </div>

            <div className="flex md:block mt-5">
              <Frame className="text-sm space-y-1  [&_span]:font-semibold [&_span]:text-[#666] [&_span]:mr-1">
                <p>
                  <span>Total plays:</span>
                  {songData?.today_play}
                </p>
                <p>
                  <span>Week plays:</span>
                  {songData?.week_play}
                </p>
                <p>
                  <span>Today plays:</span>
                  {songData?.today_play}
                </p>
                <p>
                  <span>Ranking:</span>
                  {songData?.last_week_rank}
                </p>
                <p>
                  <span>Likes:</span>
                  {songData?.like}
                </p>
                <p>
                  <span>Comment:</span>
                  {songData?.comment}
                </p>
                <p>
                  <span>Last listen:</span>
                  {dateFromTimestamp(songData?.last_active)}
                </p>
              </Frame>

              <div className="ml-3 md:ml-0 md:mt-3">
                <ButtonGroup isEdit={props.variant === "edit"} />
              </div>
            </div>
          </div>

          <div className="mt-5 md:mt-0 space-y-5 flex-grow">
            <PlayChart />

            <Frame>
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
