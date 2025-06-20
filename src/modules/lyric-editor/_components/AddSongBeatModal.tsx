import { ChangeEvent } from "react";
import useAddSongBeatModal from "../_hooks/useAddSongBeatModal";
import { Button, ModalContentWrapper, ModalHeader } from "@/components";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";

type Props = {
  closeModal: () => void;
};

export default function AddSongBeatModal({ closeModal }: Props) {
  const { theme } = useThemeContext();
  const { songFile, setSongFile, isFetching, handleSubmit, song } =
    useAddSongBeatModal({
      closeModal,
    });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSongFile(e.target.files[0]);
  };

  return (
    <ModalContentWrapper className="w-[500px]">
      <ModalHeader title="Song beat" close={closeModal} />
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

      <Button size={"clear"}>
        <label
          htmlFor="song_upload"
          className={`${theme.content_bg} seld-start rounded-full px-5 py-1.5 cursor-pointer mt-2`}
        >
          <ArrowUpTrayIcon className="w-5" />
        </label>
      </Button>

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
