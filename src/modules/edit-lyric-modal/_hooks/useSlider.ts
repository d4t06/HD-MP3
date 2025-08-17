import { useEditLyricContext } from "@/modules/lyric-editor/_components/EditLyricContext";
import { useLyricEditorContext } from "../_components/LyricEditorContext";
import { HTMLAttributes } from "react";
import { editLyricFormatTime } from "@/modules/lyric-editor";

export default function useSlider() {
  const { currentLyric } = useEditLyricContext();

  const {
    eleRefs,
    isChangedRef,
    actuallyEndRef,
    actuallyStartRef,
    tempActuallyStartRef,
    setGrowList,
  } = useLyricEditorContext();

  const { startRefText, endRefText } = eleRefs;

  type Range = {
    variant: "range";
    value: number;
    index: number;
  };

  type Button = {
    variant: "button";
    action: "minus" | "plus";
    index: number;
  };

  const handleGrowWord = (props: Range | Button) => {
    isChangedRef.current = true;

    setGrowList((prev) => {
      const _prev = [...prev];

      let newValue = _prev[props.index];

      switch (props.variant) {
        case "range":
          newValue = props.value;
          break;
        case "button":
          newValue = +(
            props.action === "minus" ? newValue - 0.1 : newValue + 0.1
          ).toFixed(1);
      }

      if (newValue < 0) newValue = 0;

      _prev[props.index] = newValue;

      return _prev;
    });
  };

  const setEndPoint = (time: number) => {
    if (!currentLyric) return;

    const newEnd = +time.toFixed(1);
    isChangedRef.current = true;

    actuallyEndRef.current = newEnd;
    if (endRefText.current) {
      endRefText.current.textContent = `${editLyricFormatTime(newEnd)} / ${editLyricFormatTime(currentLyric.end)}`;
    }
    if (tempActuallyStartRef.current) {
      actuallyEndRef.current = newEnd;
      actuallyStartRef.current = newEnd - 1;
    }
  };

  const setStartPoint = (time: number) => {
    if (!currentLyric) return;

    const newStart = +time.toFixed(1);
    isChangedRef.current = true;

    actuallyStartRef.current = newStart;
    if (startRefText.current) {
      startRefText.current.textContent = `${editLyricFormatTime(currentLyric.start)} / ${editLyricFormatTime(newStart)}`;
    }
  };

  const endTimeRangeProps: HTMLAttributes<HTMLInputElement> = {
    onFocus: () => {
      tempActuallyStartRef.current = actuallyStartRef.current;
      actuallyStartRef.current = actuallyEndRef.current - 1;
    },
    onBlur: () => {
      actuallyStartRef.current = tempActuallyStartRef.current;
      tempActuallyStartRef.current = 0;
    },
  };

  return { setEndPoint, setStartPoint, endTimeRangeProps, handleGrowWord };
}
