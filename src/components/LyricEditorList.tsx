import { RefObject, useRef } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { useEditLyricContext } from "@/store/EditSongLyricContext";
import { AddLyricItem, LyricItem } from ".";
import { useTheme } from "@/store";

type Props = {
  controlRef: RefObject<LyricEditorControlRef>;
};

export default function LyricEditorList({ controlRef }: Props) {
  const { theme } = useTheme();

  const { baseLyricArr, lyrics, currentLyricIndex, updateLyric } = useEditLyricContext();

  const scrollBehavior = useRef<ScrollBehavior>("instant");

  const handleSeek = (second: number) => {
    controlRef.current?.seek(second);
  };

  return (
    <>
      <div
        className={`flex flex-grow overflow-auto no-scrollbar rounded-xl pt-3 mt-3 bg-black/10`}
      >
        <div className={"w-1/2 px-2"}>
          {!!baseLyricArr.length ? (
            <>
              {baseLyricArr.map((lyric, index) => {
                const status =
                  index === currentLyricIndex
                    ? "active"
                    : index < currentLyricIndex
                    ? "done"
                    : "coming";

                return (
                  <LyricItem
                    className="pt-[37px] text-[18px] mr-[24px]"
                    key={index}
                    status={status}
                    text={lyric}
                    scrollBehavior={scrollBehavior}
                  />
                );
              })}
            </>
          ) : (
            <p>...</p>
          )}
        </div>

        <div className={"w-1/2 px-2"}>
          {!!lyrics?.length &&
            lyrics.map((lyric, index) => (
              <AddLyricItem
                seek={handleSeek}
                lyric={lyric}
                key={index}
                theme={theme}
                updateLyric={(text) => updateLyric(index, text)}
              />
            ))}
        </div>
      </div>
    </>
  );
}
