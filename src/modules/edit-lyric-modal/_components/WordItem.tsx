import { useLyricEditorContext } from "./LyricEditorContext";
import { Button } from "@/components";
import { ScissorsIcon } from "@heroicons/react/24/outline";

type Props = {
  text: string;
  openModal: () => void;
  index: number;
  isShowScissor: boolean;
};

export function WordItem({ text, openModal, isShowScissor, index }: Props) {
  const { growList, setWordIndex, wordIndex, eventRefs, eleRefs } =
    useLyricEditorContext();

  const active = wordIndex === index;

  const handleSelectWord = () => {
    if (index === -1) return;
    setWordIndex(index);
    eventRefs.moveArrowToGrowRef.current = true;
    // setIsChangeWordGrow(true); // for handle keyboard event

    eleRefs.growInputRef.current?.focus();
  };

  return (
    <div
      ref={(el) => (active ? (eleRefs.currentWordRef.current = el) : {})}
      style={{ flexGrow: growList[index] !== 0 ? growList[index] : 0.05 }}
      onClick={handleSelectWord}
      className={`word-item cursor-pointer relative rounded-full flex items-center justify-center 
      ${active ? "bg-[--primary-cl] text-white" : "bg-[--a-5-cl]"}`}
    >
      <span>{text}</span>

      {isShowScissor && active && (
        <Button
          onClick={openModal}
          size={"clear"}
          className="!absolute bottom-0 translate-y-[16px] bg-[--popup-cl] text-[--text-cl] shadow-[0_0_6px__rgba(0,0,0,0.3)] p-1.5"
        >
          <ScissorsIcon className="w-5" />
        </Button>
      )}
    </div>
  );
}
