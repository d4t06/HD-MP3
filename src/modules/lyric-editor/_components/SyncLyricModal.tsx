import { FormEvent, useEffect, useRef } from "react";
import { useEditLyricContext } from "./EditLyricContext";
import { Input, ModalContentWrapper, ModalHeader } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { getLocalStorage } from "@/utils/appHelpers";
import { useToastContext } from "@/stores";

type Props = {
  closeModal: () => void;
};

export default function SyncLyricModal({ closeModal }: Props) {
  const { lyrics, setLyrics, setIsChanged, song } = useEditLyricContext();

  const { setErrorToast } = useToastContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSyncLyric = (e: FormEvent) => {
    e.preventDefault();
    if (!song) return;

    const time = +(inputRef.current?.value || "");
    if (!time) return;

    const currentLyricIndex = +getLocalStorage()["edit_current-lyric-index"];
    if (!isNaN(currentLyricIndex)) {
      const newLyrics = [...lyrics];

      if (time < 0) {
        const isOverDownSync =
          lyrics[currentLyricIndex].start + time <
          (currentLyricIndex > 0 ? lyrics[currentLyricIndex - 1].start : 0);
        if (isOverDownSync) {
          setErrorToast("Invalid number");
          return;
        }
      }

      // if (time > 0) {
      //   // inValid
      //   const isOverUp = lyrics[lyrics.length - 1].start + time > song.duration;
      //   if (isOverUp) {
      //     setErrorToast("Invalid number");
      //     return;
      //   }
      // }

      newLyrics.forEach((_item, index) => {
        if (index >= currentLyricIndex) {
          newLyrics[index].start = +(newLyrics[index].start + time).toFixed(1);
          newLyrics[index].end = +(newLyrics[index].end + time).toFixed(1);
        }
      });

      if (currentLyricIndex > 0)
        newLyrics[currentLyricIndex - 1].end =
          newLyrics[currentLyricIndex].start;

      lyrics[lyrics.length - 1].end = song.duration;

      setLyrics(newLyrics);

      setIsChanged(true);

      closeModal();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <ModalContentWrapper>
      <ModalHeader title="Sync lyric" closeModal={closeModal} />

      <form action="" onSubmit={handleSyncLyric}>
        <Input step={0.2} ref={inputRef} type="number" />

        <p className="mt-5 text-right">
          <Button type="submit">Save</Button>
        </p>
      </form>
    </ModalContentWrapper>
  );
}
