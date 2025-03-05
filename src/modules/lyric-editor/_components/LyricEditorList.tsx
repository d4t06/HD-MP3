import { ElementRef, RefObject, useEffect, useRef } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { useEditLyricContext } from "@/stores/EditLyricContext";
import { useThemeContext } from "@/stores";
import { LyricStatus } from "../";
import { LyricItem, ModalRef } from "@/components";
// import { useLyricContext } from "@/stores/LyricContext";
import { scrollIntoView } from "@/utils/appHelpers";
import AddLyricItem from "./AddLyricItem";

type Props = {
  controlRef: RefObject<LyricEditorControlRef>;
  modalRef: RefObject<ModalRef>;
};

function useLyricEditorList() {
  const { lyrics } = useEditLyricContext();

  const activeLyricRef = useRef<ElementRef<"p">>(null);

  useEffect(() => {
    if (!activeLyricRef.current) return;

    scrollIntoView(activeLyricRef.current);
  }, [lyrics.length]);

  return { activeLyricRef };
}

export default function LyricEditorList({ controlRef, modalRef }: Props) {
  const { theme } = useThemeContext();
  const { baseLyricArr, lyrics, setSelectLyricIndex, song } = useEditLyricContext();

  const { activeLyricRef } = useLyricEditorList();

  const handleSeek = (second: number) => {
    controlRef.current?.seek(second);
  };

  const handleOpenEditLyricModal = (index: number) => {
    if (typeof index !== "number") return;

    setSelectLyricIndex(index);
    modalRef.current?.open();
  };

  return (
    <>
      <div
        className={`flex flex-grow overflow-auto no-scrollbar text-[18px] rounded-xl pt-3 mt-3 ${theme.side_bar_bg}`}
      >
        <div className={"w-1/2 px-2"}>
          {!!baseLyricArr.length ? (
            <>
              {baseLyricArr.map((lyric, index) => {
                let status: LyricStatus =
                  index === lyrics.length
                    ? "active"
                    : index < lyrics.length - 1
                    ? "done"
                    : "coming";

                if (index === baseLyricArr.length - 1) status = "active";

                return (
                  <LyricItem
                    ref={status === "active" ? activeLyricRef : null}
                    activeColor={theme.type === "light" ? theme.content_text : ""}
                    className="pt-[37px] mr-[24px]"
                    key={index}
                    status={status}
                    text={lyric}
                  />
                );
              })}
            </>
          ) : (
            <p>...</p>
          )}
        </div>

        <div className={"w-1/2 px-2 "}>
          {!!lyrics?.length &&
            song &&
            lyrics.map((lyric, index) => (
              <AddLyricItem
                openModal={() => handleOpenEditLyricModal(index)}
                seek={handleSeek}
                lyric={lyric}
                isLast={index === lyrics.length - 1 && index !== baseLyricArr.length - 1}
                key={index}
                theme={theme}
              />
            ))}
        </div>
      </div>
    </>
  );
}
