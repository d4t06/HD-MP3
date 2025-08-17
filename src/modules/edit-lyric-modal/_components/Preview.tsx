import { ElementRef, useEffect, useRef, useState } from "react";
import { inputClasses } from "@/components/ui/Input";
import { useLyricEditorContext } from "./LyricEditorContext";
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Preview() {
  const {
    eleRefs,
    eventRefs,
    setText,
    mergedGrowListRef,
    setCut,
    setGrowList,
    text,
    isChangedRef,
  } = useLyricEditorContext();

  const [isEditText, setIsEditText] = useState(false);

  const inputRef = useRef<ElementRef<"textarea">>(null);

  const handleUpdateLyricText = () => {
    if (!inputRef.current) return;

    const newText = inputRef.current.value
      .split(/\r?\n/)
      .filter((v) => v)
      .map((v) => v.trim())
      .join(" ") // join break line
      .split(" ")
      .filter((v) => v)
      .join(" ");

    setText(newText);

    // reset cut and grow
    const grow = newText.split(" ").map(() => 0);
    const cut = newText.split(" ").map(() => []);

    setCut(cut);
    setGrowList(grow);
    mergedGrowListRef.current = grow;

    setIsEditText(false);
    isChangedRef.current = true;
  };

  useEffect(() => {
    if (isEditText) {
      eventRefs.playWhenSpaceRef.current = false;
      eventRefs.moveArrowToGrowRef.current = false;
      if (inputRef.current) inputRef.current.value = text;
    } else {
      eventRefs.playWhenSpaceRef.current = true;
      eventRefs.moveArrowToGrowRef.current = true;
    }
  }, [isEditText]);

  return (
    <div className="mt-3 relative pt-5 font-[Inter,system-ui]">
      <div className="absolute top-0 right-0 flex justify-end w space-x-2 hover:[&>button]:bg-black/10 [&>button]:rounded-full [&>button]:p-1">
        {!isEditText ? (
          <button onClick={() => setIsEditText(true)}>
            <PencilIcon className="w-5" />
          </button>
        ) : (
          <>
            <button onClick={() => setIsEditText(false)}>
              <XMarkIcon className="w-5" />
            </button>
            <button onClick={handleUpdateLyricText}>
              <CheckIcon className="w-5" />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center">
        {isEditText ? (
          <textarea
            ref={inputRef}
            rows={1}
            className={`${inputClasses} w-full mt-3 bg-[--a-5-cl]`}
          />
        ) : (
          <>
            <div className="relative whitespace-nowrap  sm:text-2xl font-[700]">
              {text}
              <div
                ref={eleRefs.overlayRef}
                className="absolute  top-0 left-0 overflow-hidden text-[--primary-cl] whitespace-nowrap w-0"
              >
                {text}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
