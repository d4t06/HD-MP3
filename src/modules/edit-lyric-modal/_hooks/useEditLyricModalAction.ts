import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";

export default function useEditLyricModalAction() {
  const { updateLyric, setIsChanged, selectLyricIndex } = useEditLyricContext();

  const { actuallyEndRef, actuallyStartRef, growList, text, cut } =
    useLyricEditorContext();

  const updateLyricTune = async () => {
    if (typeof selectLyricIndex !== "number")
      throw new Error("selectLyricIndex is undefine");

    const newLyricData: Partial<Lyric> = {
      tune: {
        start: actuallyStartRef.current,
        end: actuallyEndRef.current,
        grow: growList,
      },
      cut,
      text,
    };

    updateLyric(selectLyricIndex, newLyricData);

    setIsChanged(true);
  };

  return {
    updateLyricTune,
  };
}
