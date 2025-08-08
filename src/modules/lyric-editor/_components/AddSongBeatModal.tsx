import { ChangeEvent, useRef } from "react";
import useAddSongBeatModal from "../_hooks/useAddSongBeatModal";
import { Button, ModalContentWrapper, ModalHeader } from "@/components";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

type Props = {
  closeModal: () => void;
};

export default function AddSongBeatModal({ closeModal }: Props) {
  const labelRef = useRef<HTMLLabelElement>(null);

  const { songFile, setSongFile, isFetching, handleSubmit, song } =
    useAddSongBeatModal({
      closeModal,
    });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSongFile(e.target.files[0]);
  };

  return (
    <ModalContentWrapper className="w-[500px]">
      <ModalHeader title="Song beat" closeModal={closeModal} />

      <label ref={labelRef} className="hidden" htmlFor="song_upload"></label>

      <input
        onChange={handleInputChange}
        type="file"
        multiple
        accept="audio"
        id="song_upload"
        className="hidden"
      />

      {song && (songFile || song?.beat_url) && (
        <audio
          src={songFile ? URL.createObjectURL(songFile) : song.beat_url}
          controls
        />
      )}

      <p className="mt-3">
        <Button onClick={() => labelRef.current?.click()} color="primary">
          <ArrowUpTrayIcon className="w-5" />
        </Button>
      </p>

      <Button
        disabled={!songFile}
        onClick={handleSubmit}
        isLoading={isFetching}
        color="primary"
        className="mt-3 ml-auto font-playwriteCU"
      >
        Save
      </Button>
    </ModalContentWrapper>
  );
}
