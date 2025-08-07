import { Button, ModalContentWrapper, Title } from "@/components";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { splitStringByCutPositions } from "@/utils/lyricEditorHelper";
import { ScissorsIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useLyricEditorContext } from "./LyricEditorContext";

type Props = {
  wordData: { text: string; positions: number[] };
  wordIndex: number;
  closeModal: () => void;
};

export default function SplitWordModal({
  wordData,
  wordIndex,
  closeModal,
}: Props) {
  const { currentLyric, selectLyricIndex } = useEditLyricContext();
  const { setCut, cut } = useLyricEditorContext();

  const [localCut, seLocalCut] = useState(wordData.positions);

  const localSplitWords = useMemo(
    () => splitStringByCutPositions(wordData.text, localCut).filter((w) => w),
    [localCut],
  );

  const characters = useMemo(() => wordData.text.split(""), []);

  const splitWord = (index: number) => {
    const newCutPositions = [...localCut];

    const foundedIndex = localCut.findIndex((i) => i === index);

    if (foundedIndex === -1) {
      newCutPositions.push(index);
    } else newCutPositions.splice(foundedIndex, 1);

    seLocalCut(newCutPositions);
  };

  const apply = () => {
    if (!currentLyric || selectLyricIndex === undefined) return;

    const sortedNewCut = localCut.sort((a, b) => a - b);

    const newCut = [...cut];
    newCut[wordIndex] = sortedNewCut;

    setCut(newCut);

    closeModal();
  };

  return (
    <ModalContentWrapper className="w-[500px]">
      <Title title="Split word " />
      <div className="flex justify-center space-x-5">
        {localSplitWords.map((w, i) => (
          <span key={i} className="text-xl md:text-2xl font-[700]">
            {w}
          </span>
        ))}
      </div>

      <div className="mt-3 flex justify-center">
        {characters.map((c, i) => {
          const isSplited = localCut.includes(i);

          return (
            <div key={i}>
              {characters.length > 1 && !!i ? (
                <button
                  onClick={() => splitWord(i)}
                  className={` p-1 rounded-full ${
                    isSplited ? "bg-[--primary-cl] text-white" : "hover:bg-black/10"
                  }`}
                >
                  <ScissorsIcon className="w-5" />
                </button>
              ) : (
                ""
              )}
              <span className="text-[50px] font-[500]">{c}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-right">
        <Button onClick={apply} color="primary" className="font-playwireCU">
          OK
        </Button>
      </p>
    </ModalContentWrapper>
  );
}
