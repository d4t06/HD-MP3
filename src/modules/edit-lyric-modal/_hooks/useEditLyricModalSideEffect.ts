import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useEffect } from "react";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { getWordsRatio } from "@/utils/getWordsRatio";
import { mergeGrow } from "@/utils/mergeGrow";

export default function useEditLyricModalSideEffect() {
  const { selectLyricIndex, currentLyric } = useEditLyricContext();

  const {
    eleRefs,
    actuallyEndRef,
    mergedGrowListRef,
    actuallyStartRef,
    wordsRatioRef,
    setGrowList,
    setCut,
    setText,
    currentWords,
  } = useLyricEditorContext();

  const { tempWordRef, endTimeRangeRef, startTimeRangeRef, startRefText, endRefText } =
    eleRefs;

  // change when lyirc text change
  useEffect(() => {
    if (!tempWordRef.current) return;

    const list = getWordsRatio(tempWordRef.current);
    wordsRatioRef.current = list;
  }, [currentWords]);

  // only change when index changed, not lyric data
  useEffect(() => {
    if (!currentLyric) return;

    const grow = currentLyric.tune.grow;

    const words = currentLyric.text.split(" ").filter((v) => v.trim());
    setText(currentLyric.text);
    setCut(currentLyric.cut);

    const mergedGrowList = mergeGrow(words, currentLyric.cut, grow);
    setGrowList(grow);
    mergedGrowListRef.current = mergedGrowList;

    // update slider
    if (
      endRefText.current &&
      startRefText.current &&
      startTimeRangeRef.current &&
      endTimeRangeRef.current
    ) {
      actuallyStartRef.current = currentLyric?.tune
        ? currentLyric.tune.start
        : currentLyric.start;
      startRefText.current.innerText = `${currentLyric.start} / ${actuallyStartRef.current}`;

      startTimeRangeRef.current.max = currentLyric.end + "";
      startTimeRangeRef.current.value = actuallyStartRef.current + "";

      actuallyEndRef.current = currentLyric?.tune
        ? currentLyric.tune.end
        : currentLyric.end;
      endRefText.current.innerText = `${actuallyEndRef.current} / ${currentLyric.end}`;

      endTimeRangeRef.current.max = currentLyric.end + "";
      endTimeRangeRef.current.value = actuallyEndRef.current + "";
    }
  }, [selectLyricIndex]);

  // useEffect(() => {//   setLoacalLyricIndex(selectLyricIndex);
  // }, [selectLyricIndex]);
}
