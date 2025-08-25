import { FormEvent, useEffect, useRef, useState } from "react";
import { useEditLyricContext } from "./EditLyricContext";
import { Input, Label, ModalContentWrapper, ModalHeader } from "@/components";
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
  const [isForThisLine, setIsForThisLine] = useState(false);

  const handleSyncLyric = (e: FormEvent) => {
    e.preventDefault();
    if (!song) return;

    const time = +(inputRef.current?.value || "");
    if (!time) return;

    const currentLyricIndex = +getLocalStorage()["edit_current-lyric-index"];
    if (!isNaN(currentLyricIndex)) {
      const newLyrics = [...lyrics];

      const moveOffSet = (index: number) => {
        const newTimeData = {
          start: +(newLyrics[index].start + time).toFixed(1),
          end: +(newLyrics[index].end + time).toFixed(1),
        };

        newLyrics[index] = {
          ...newLyrics[index],
          ...newTimeData,
          tune: { ...newLyrics[index].tune, ...newTimeData },
        };
      };

      if (time < 0) {
        const isOverDownSync =
          lyrics[currentLyricIndex].start + time <
          (currentLyricIndex > 0 ? lyrics[currentLyricIndex - 1].start : 0);
        if (isOverDownSync) {
          setErrorToast("Invalid number");
          return;
        }
      }

      let i = currentLyricIndex;
      for (; i < lyrics.length; i++) {
        moveOffSet(i);
        if (isForThisLine) break;
      }

      if (currentLyricIndex > 0) {
        newLyrics[currentLyricIndex - 1].end =
          newLyrics[currentLyricIndex].start;

        newLyrics[currentLyricIndex - 1].tune.end =
          newLyrics[currentLyricIndex].start;
      }

      newLyrics[lyrics.length - 1].end = song.duration;
      newLyrics[lyrics.length - 1].tune.end = song.duration;

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

        <div className="flex items-center mt-3">
          <input
            checked={isForThisLine}
            onChange={() => setIsForThisLine((prev) => !prev)}
            type="checkbox"
            id="for-this-line"
            className=""
          />
          <Label htmlFor="for-this-line" className="ml-2">
            For this line only
          </Label>
        </div>

        <p className="mt-5 text-right">
          <Button type="submit">Save</Button>
        </p>
      </form>
    </ModalContentWrapper>
  );
}
