import { useEffect, useRef } from "react";
import { useEditLyricContext } from "./EditLyricContext";
import { Input, ModalContentWrapper, ModalHeader } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { getLocalStorage } from "@/utils/appHelpers";

type Props = {
  closeModal: () => void;
};

export default function SyncLyricModal({ closeModal }: Props) {
  const { lyrics, setLyrics, setIsChanged } = useEditLyricContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSyncLyric = () => {
    const time = +(inputRef.current?.value || "");
    if (!time) return;

    const currentLyricIndex = +getLocalStorage()["edit_current-lyric-index"];
    if (!isNaN(currentLyricIndex)) {
      const newLyrics = [...lyrics];

      if (time < 0) {
        const isOverDownSync = lyrics[0].end + time < 0;
        if (isOverDownSync) return;
      }

      newLyrics.forEach((_item, index) => {
        if (index >= currentLyricIndex) {
          newLyrics[index].start = +(newLyrics[index].start + time).toFixed(1);
          newLyrics[index].end = +(newLyrics[index].end + time).toFixed(1);
        }
      });

      setLyrics(newLyrics);

      setIsChanged(true);

      closeModal();
    }
  };

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <ModalContentWrapper>
      <ModalHeader title="Sync lyric" closeModal={closeModal} />

      <Input step={0.2} ref={inputRef} type="number" />

      <p className="mt-5 text-right">
        <Button onClick={handleSyncLyric}>Save</Button>
      </p>
    </ModalContentWrapper>
  );
}
