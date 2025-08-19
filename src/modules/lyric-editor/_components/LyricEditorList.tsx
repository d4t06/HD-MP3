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
  const { lyrics, viewMode } = useEditLyricContext();

  const activeLyricRef = useRef<ElementRef<"p">>(null);
  const behavior = useRef<ScrollBehavior>("instant");

  useEffect(() => {
    if (!activeLyricRef.current || viewMode === "preview") return;

    scrollIntoView(activeLyricRef.current, behavior.current);

    behavior.current = "instant";
    if (behavior.current === "instant") behavior.current = "smooth";
  }, [lyrics.length, viewMode]);

  useEffect(() => {
    return () => {
      behavior.current = "instant";
    };
  }, [viewMode]);

  return { activeLyricRef };
}

export default function LyricEditorList({
  controlRef,
  audioEle,
  openEditModal,
}: Props) {
  // const { theme } = useThemeContext();
  const {
    baseLyricArr,
    lyrics,
    setLyrics,
    setSelectLyricIndex,
    song,
    viewMode,
  } = useEditLyricContext();

  const { activeLyricRef } = useLyricEditorList();

  const { currentIndex, lyricRefs } = useLyric({
    audioEle,
    isActive: viewMode !== "edit",
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

  const removeLyric = (index: number) => {
    if (!song) return;

    const newLyrics = [...lyrics];

    const isLast = index === lyrics.length - 1;

    if (index === 0) {
      newLyrics[1].start = 0;
    } else if (!isLast) {
      newLyrics[index - 1].end = newLyrics[index + 1].start;
    }

    newLyrics.splice(index, 1);

    newLyrics[newLyrics.length - 1].end = song.duration;

    setLyrics(newLyrics);
  };

  // for sync lyrix function
  useEffect(() => {
    setLocalStorage("edit_current-lyric-index", currentIndex);
  }, [currentIndex]);

  return (
    <>
      <div
        className={`flex-grow overflow-auto flex font-[Inter,system-ui] no-scrollbar rounded-xl px-2 pt-3 mt-3 bg-[--popup-cl] shadow-[0_0_6px_0_rgba(0,0,0,0.15)] ${getClasses(viewMode !== "edit", "justify-center")}`}
      >
        {!!baseLyricArr.length && (
          <div className={`w-1/2 ${getClasses(viewMode !== "edit", "hidden")}`}>
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
                    className="pt-10"
                    activeColor="text-[--primary-cl]"
                    key={index}
                    status={status}
                    text={lyric}
                  />
                );
              })}
            </>
          </div>
        )}

        <div
          className={`w-1/2 ${getClasses(viewMode !== "edit", "text-center")}`}
        >
          {!!lyrics?.length &&
            song &&
            lyrics.map((lyric, index) => {
              let status: LyricStatus = "coming";

              if (viewMode !== "edit") {
                if (currentIndex === index) status = "active";
                else if (index < currentIndex) status = "done";
              }

              return (
                <AddLyricItem
                  ref={(el) => (lyricRefs.current[index] = el!)}
                  openModal={() => handleOpenEditLyricModal(index)}
                  seek={handleSeek}
                  removeLyric={() => removeLyric(index)}
                  viewMode={viewMode}
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
