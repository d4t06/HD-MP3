import { ChangeEvent, useMemo } from "react";
import useChangeSongFile from "../_hooks/useChaneSongFileModal";
import { ModalContentWrapper, ModalHeader } from "@/components";
import { Button } from "@/pages/dashboard/_components";

type Props = {
  closeModal: () => void;
};

export default function ChangeSongFileModal({ closeModal }: Props) {
  const { songFile, setSongFile, isFetching, submit } = useChangeSongFile({
    closeModal,
  });

  const songUrl = useMemo(
    () => (songFile ? URL.createObjectURL(songFile) : ""),
    [songFile],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSongFile(e.target.files[0]);
  };

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader title="Change song file" closeModal={closeModal} />

        {!songFile && (
          <input accept="audio" type="file" onChange={handleInputChange} />
        )}

        {songFile && <audio src={songUrl} controls />}

        <p className="text-right">
          <Button loading={isFetching} className="mt-5" onClick={submit}>
            Save
          </Button>
        </p>
      </ModalContentWrapper>
    </>
  );
}
