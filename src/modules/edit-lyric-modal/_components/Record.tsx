import { Button } from "@/components";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import useRecord from "../_hooks/useRecord";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Record({ audioEle }: Props) {
  const { currentSplitWords } = useEditLyricContext();

  const { buttonProps, localGrowList, isRecording, clear } = useRecord({ audioEle });

  return (
    <>
      <Button
        disabled={!isRecording}
        size={"clear"}
        className="p-1.5"
        onClick={clear}
        color="primary"
      >
        <XMarkIcon className="w-6" />
      </Button>

      <div className="h-[240px] flex justify-center gap-2 items-center md:text-xl font-[700]">
        {currentSplitWords.map((w, i) => {
          return (
            <span
              className={`${
                i < localGrowList.length ? "text-[#ffed00]" : ""
              } leading-[1]`}
              key={i}
            >
              {w}
            </span>
          );
        })}
      </div>

      <p className="mt-3 text-center md: hidden">
        <Button {...buttonProps} color="primary">
          Record
        </Button>
      </p>
    </>
  );
}
