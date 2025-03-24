import { WordItem } from "./WordItem";
import { useMemo, useRef, useState } from "react";
import { Modal, ModalRef } from "@/components";
import SplitWordModal from "./SplitWordModal";
import { useLyricEditorContext } from "./LyricEditorContext";

export default function WordList() {
  const { currentSplitWords, currentWordsData, currentWords } = useLyricEditorContext();

  const [currentWordIndex, setCurrentWordIndex] = useState<number>();

  const modalRef = useRef<ModalRef>(null);

  const wordIndexBySplitWordIndex = useMemo(() => {
    const wordIndexBySplitWordIndex: Record<number, number> = {};

    const numberOfCutByWord = currentWordsData.map((data) => data.positions.length);

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
  }, [currentWordsData]);

  const currentWord = useMemo(
    () =>
      currentWordIndex !== undefined ? currentWordsData[currentWordIndex] : undefined,
    [currentWordIndex, currentWordsData],
  );

  const handleOpenModal = (wordIndex: number) => {
    setCurrentWordIndex(wordIndex);

    modalRef.current?.open();
  };

  return (
    <>
      <div className="flex h-[44px] mt-5">
        {currentSplitWords.map((w, i) => {
          const parentWordIndex = wordIndexBySplitWordIndex[i];
          const parentWord = currentWords[parentWordIndex];

          return (
            <WordItem
              isShowScissor={parentWord ? parentWord.length > 1 : false}
              key={i}
              index={i}
              openModal={() => handleOpenModal(parentWordIndex)}
              text={w}
            />
          );
        })}
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
