import { Button, ModalContentWrapper, ModalHeader } from "@/components";
import { useThemeContext } from "@/stores";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useEditLyricContext } from "./EditLyricContext";

type Props = {
  closeModal: () => void;
};

const LINE_HEIGHT = 40;

export default function EditStringLyricModal({ closeModal }: Props) {
  const { theme } = useThemeContext();

  const { baseLyric, setBaseLyric, baseLyricArr, setIsChanged, lyrics } =
    useEditLyricContext();
  const [value, setValue] = useState(baseLyric);

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const backRef = useRef<ElementRef<"div">>(null);

  const handleSubmit = () => {
    const formatedLyric = value
      .split(/\r?\n/)
      .filter((v) => v)
      .filter((v) => v.trim())
      .join("\r\n");

    setBaseLyric(formatedLyric);
    setIsChanged(true);
    closeModal();
  };

  function applyHighlights(index: number) {
    const newArray = [...baseLyricArr];

    newArray[index] =
      `<div style="color: transparent; border-radius: 4px; background-color: ${theme.content_code}">${newArray[index]}</div>`;

    return newArray.join("\r\n");
  }

  useEffect(() => {
    if (lyrics.length && textareaRef.current && backRef.current) {
      const needToScroll = LINE_HEIGHT * (lyrics.length - 1);
      textareaRef.current.scrollTop = needToScroll;
      backRef.current.style.paddingBottom = needToScroll + "px";
    }
  }, []);

  useEffect(() => {
    const handleScroll: EventListener = () => {
      if (textareaRef.current && backRef.current) {
        const scrollTop = textareaRef.current.scrollTop;
        backRef.current.scrollTop = scrollTop;
      }
    };

    if (textareaRef.current)
      textareaRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (textareaRef.current)
        textareaRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ModalContentWrapper className="w-[500px]">
      <ModalHeader close={closeModal} title="Edit lyric" />

      <div
        className={`relative h-[60vh] overflow-hidden rounded-md ${location.hash.includes("/dashboard") ? 'bg-black/10' : 'bg-white/10'} `}
      >
        <div
          ref={backRef}
          className="whitespace-break-spaces text-transparent px-2 py-2 absolute leading-[40px] h-full overflow-auto top-0 left-0 w-full"
          dangerouslySetInnerHTML={{
            __html: applyHighlights(
              lyrics.length === baseLyricArr.length
                ? lyrics.length - 1
                : lyrics.length,
            ),
          }}
        ></div>

        <textarea
          style={{ resize: "none" }}
          ref={textareaRef}
          className={`absolute bg-transparent top-0 outline-none w-full leading-[40px] py-2 px-3 h-full no-scrollbar`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <p className="ml-auto mt-5">
        <Button
          onClick={handleSubmit}
          color="primary"
          className={`rounded-full`}
        >
          Save
        </Button>
      </p>
    </ModalContentWrapper>
  );
}
