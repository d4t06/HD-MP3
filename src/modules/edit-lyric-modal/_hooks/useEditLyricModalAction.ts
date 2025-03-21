import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

export default function useEditLyricModalAction() {
  const { updateLyric, setIsChanged, selectLyricIndex } = useEditLyricContext();

  const {
    actuallyEndRef,
    actuallyStartRef,

    growList,
  } = useLyricEditorContext();

  const updateLyricTune = () => {
    if (typeof selectLyricIndex !== "number") return;

    const newLyricData: Partial<RealTimeLyric> = {
      tune: {
        start: actuallyStartRef.current,
        end: actuallyEndRef.current,
        grow: growList.join("_"),
      },
    };
    updateLyric(selectLyricIndex, newLyricData);

    setIsChanged(true);
  };

  return {
    updateLyricTune,
  };
}
