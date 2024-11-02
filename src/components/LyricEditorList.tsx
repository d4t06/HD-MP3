import { RefObject, useRef } from "react";
import { LyricEditorControlRef } from "./LyricEditorControl";
import { useEditLyricContext } from "@/store/EditSongLyricContext";
import { AddLyricItem, LyricItem } from ".";
import { useTheme } from "@/store";
import { LyricStatus } from "./LyricEditor";

type Props = {
  controlRef: RefObject<LyricEditorControlRef>;
};

export default function LyricEditorList({ controlRef }: Props) {
  const { theme } = useTheme();

  const { baseLyricArr, lyrics, currentLyricIndex, updateLyric } = useEditLyricContext();

  const scrollBehavior = useRef<ScrollBehavior>("auto");

  const handleSeek = (second: number) => {
    controlRef.current?.seek(second);
  };

  const getBg = () => {
    if (theme.type === "dark") return "bg-white/10";
    else return "bg-black/10";
  };

  return (
    <>
      <div
        className={`flex flex-grow overflow-auto no-scrollbar rounded-xl pt-3 mt-3 ${getBg()}`}
      >
        <div className={"w-1/2 px-2"}>
          {!!baseLyricArr.length ? (
            <>
              {baseLyricArr.map((lyric, index) => {
                let status: LyricStatus =
                  index === currentLyricIndex
                    ? "active"
                    : index < currentLyricIndex
                    ? "done"
                    : "coming";

                if (index === baseLyricArr.length - 1) status = "active";

                return (
                  <LyricItem
                    activeColor={theme.type === "light" ? theme.content_text : ""}
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
                isLast={index === lyrics.length - 1 && index !== baseLyricArr.length - 1 }
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
