import { ElementRef, RefObject, useEffect, useRef } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { LyricStatus } from "../";
import {
  getClasses,
  scrollIntoView,
  setLocalStorage,
} from "@/utils/appHelpers";
import AddLyricItem from "./AddLyricItem";
import LyricItem from "@/modules/lyric/LyricItem";
import { useEditLyricContext } from "./EditLyricContext";
import useLyric from "@/modules/lyric/_hooks/useLyric";

type Props = {
  controlRef: RefObject<LyricEditorControlRef>;
  openEditModal: () => void;
  audioEle: HTMLAudioElement;
};

function useLyricEditorList() {
  const { lyrics, isPreview } = useEditLyricContext();

  const activeLyricRef = useRef<ElementRef<"p">>(null);
  const behavior = useRef<ScrollBehavior>("instant");

  useEffect(() => {
    if (!activeLyricRef.current || isPreview) return;

    scrollIntoView(activeLyricRef.current, behavior.current);

    behavior.current = "instant";
    if (behavior.current === "instant") behavior.current = "smooth";
  }, [lyrics.length, isPreview]);

  useEffect(() => {
    return () => {
      behavior.current = "instant";
    };
  }, [isPreview]);

  return { activeLyricRef };
}

export default function LyricEditorList({
  controlRef,
  audioEle,
  openEditModal,
}: Props) {
  // const { theme } = useThemeContext();
  const { baseLyricArr, lyrics, setSelectLyricIndex, song, isPreview } =
    useEditLyricContext();

  const { activeLyricRef } = useLyricEditorList();

  const { currentIndex, lyricRefs } = useLyric({
    audioEle,
    isActive: isPreview,
    lyrics,
  });

  const handleSeek = (second: number) => {
    controlRef.current?.seek(second);
  };

  const handleOpenEditLyricModal = (index: number) => {
    if (typeof index !== "number") return;

    controlRef.current?.pause();

    setSelectLyricIndex(index);

    openEditModal();
  };

  // for sync lyrix function
  useEffect(() => {
    setLocalStorage("edit_current-lyric-index", currentIndex);
  }, [currentIndex]);

  return (
    <>
      <div
        className={`flex-grow  overflow-auto flex  no-scrollbar md:text-lg rounded-xl px-2 pt-3 mt-3 bg-[--a-10-cl] ${getClasses(isPreview, "justify-center")}`}
      >
        <div className={`w-1/2 ${getClasses(isPreview, "hidden")}`}>
          {!!baseLyricArr.length ? (
            <>
              {baseLyricArr.map((lyric, index) => {
                let status: LyricStatus =
                  index === lyrics.length
                    ? "active"
                    : index < lyrics.length
                      ? "done"
                      : "coming";

                if (status === "done" && index === baseLyricArr.length - 1)
                  status = "active";

                return (
                  <LyricItem
                    ref={status === "active" ? activeLyricRef : null}
                    className="pt-[38px] mr-[24px]"
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

        <div className={`w-1/2 ${getClasses(isPreview, "text-center")}`}>
          {!!lyrics?.length &&
            song &&
            lyrics.map((lyric, index) => {
              let status: LyricStatus = "coming";

              if (isPreview) {
                if (currentIndex === index) status = "active";
                else if (index < currentIndex) status = "done";
              }

              return (
                <AddLyricItem
                  ref={(el) => (lyricRefs.current[index] = el!)}
                  openModal={() => handleOpenEditLyricModal(index)}
                  seek={handleSeek}
                  isPreview={isPreview}
                  lyric={lyric}
                  status={status}
                  activeColor={"text-[#ffed00]"}
                  isLast={
                    index === lyrics.length - 1 &&
                    index !== baseLyricArr.length - 1
                  }
                  key={index}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
