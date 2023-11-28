import { useRef, useState, Dispatch, SetStateAction, FormEvent, useEffect } from "react";
import { RealTimeLyric, ThemeType } from "../../types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Props = {
  lyric: RealTimeLyric;
  handleSetTime: (time: number) => void;
  theme: ThemeType & { alpha: string };
  realTimeLyrics: RealTimeLyric[];
  setRealTimeLyrics: Dispatch<SetStateAction<RealTimeLyric[]>>;
  index: number;
};

function AddLyricItem({
  lyric,
  handleSetTime,
  theme,
  realTimeLyrics,
  index,
  setRealTimeLyrics,
}: Props) {
  const [isEditText, setIdEditText] = useState(false);
  const [text, setText] = useState(lyric.text);
  const textRef = useRef<HTMLInputElement>(null);

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();

    const newLyrics = [...realTimeLyrics];

    const newLyric = { ...newLyrics[index], text };
    newLyrics[index] = newLyric;

    console.log("check new lyric ", newLyric);

    setRealTimeLyrics(newLyrics);
    setIdEditText(false);
  };

  const classes = {
    input: `bg-${theme.alpha} rounded-[4px] outline-none w-full px-[8px] text-[16px]`,
  };

  useEffect(() => {
    if (isEditText) {
      textRef.current?.focus();
    }
  }, [isEditText]);

  return (
    <div className="pb-[10px]">
      {!isEditText && (
        <p className="text-[16px] leading-[1.2] font-bold select-none flex items-center">
          {lyric.text}

          <button onClick={() => setIdEditText(true)} className="ml-[8px]">
            <PencilSquareIcon className="w-[16px]" />
          </button>
        </p>
      )}

      {isEditText && (
        <form action="" onSubmit={handleEdit}>
          <input
            onBlur={() => setIdEditText(false)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={textRef}
            type="text"
            className={classes.input}
          />
        </form>
      )}
      <div className="flex gap-[10px] h-[20px]">
        <button
          className={` ${theme.content_hover_text}`}
          onClick={() => handleSetTime(lyric.start)}
        >
          {lyric.start}s
        </button>
        <span> - </span>
        <button
          className={` ${theme.content_hover_text}`}
          onClick={() => handleSetTime(lyric.end)}
        >
          {lyric.end}s
        </button>
      </div>
    </div>
  );
}

export default AddLyricItem;
