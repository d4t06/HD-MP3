import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { WordItem } from "./WordItem";
import { useMemo, useRef, useState } from "react";
import { Modal, ModalRef } from "@/components";
import SplitWordModal from "./SplitWordModal";

export default function WordList() {
  const { currentSplitWords, currentLyricWordsData } = useEditLyricContext();

  const [currentWordIndex, setCurrentWordIndex] = useState<number>();

  const modalRef = useRef<ModalRef>(null);

  const wordIndexBySplitWordIndex = useMemo(() => {
    const wordIndexBySplitWordIndex: Record<number, number> = {};

    const numberOfCutByWord = currentLyricWordsData.map(
      (data) => data.cutPositions.length
    );

    let i = 0;
    numberOfCutByWord.forEach((number, index) => {
      if (number === 0) {
        wordIndexBySplitWordIndex[i] = index;
        i++;
      } else if (number > 0) {
        [...Array(number + 1).keys()].forEach(() => {
          wordIndexBySplitWordIndex[i] = index;
          i++;
        });
      }
    });

    return wordIndexBySplitWordIndex;
  }, [currentLyricWordsData]);

  const currentWord = useMemo(
    () =>
      currentWordIndex !== undefined
        ? currentLyricWordsData[currentWordIndex]
        : undefined,
    [currentWordIndex, currentLyricWordsData]
  );

  const handleOpenModal = (wordIndex: number) => {
    setCurrentWordIndex(wordIndex);

    modalRef.current?.open();
  };

  return (
    <>
      <div className="flex h-[44px] mt-5">
        {currentSplitWords.map((w, i) => (
          <WordItem
            key={i}
            index={i}
            openModal={() => handleOpenModal(wordIndexBySplitWordIndex[i])}
            text={w}
          />
        ))}
      </div>

      <Modal variant="animation" ref={modalRef}>
        {currentWord && currentWordIndex !== undefined && (
          <SplitWordModal
            wordIndex={currentWordIndex}
            closeModal={() => modalRef.current?.close()}
            wordData={currentWord}
          />
        )}
      </Modal>
    </>
  );
}
