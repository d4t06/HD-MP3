import { formatTime } from "@/utils/appHelpers";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useRef, useState, FormEvent, useEffect, ElementRef } from "react";

type Props = {
  lyric: RealTimeLyric;
  seek: (time: number) => void;
  theme: ThemeType & { alpha: string };
  updateLyric: (t: string) => void;
  isLast: boolean
};

function AddLyricItem({ lyric, seek, theme, isLast, updateLyric }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(lyric.text);
  const textRef = useRef<ElementRef<"textarea">>(null);

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();

    updateLyric(text);
    setIsEditing(false);
  };

  const classes = {
    input: `bg-${theme.alpha} text-lg rounded-[4px] outline-none w-full px-2 py-1`,
  };

  useEffect(() => {
    if (isEditing) {
      textRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className="pt-[10px] last:mb-[30vh]">
      <button
        className={`text-[18px] ${theme.content_hover_text}`}
        onClick={() => seek(lyric.start)}
      >
        {formatTime(lyric.start)}
      </button>

      {!isEditing && (
        <p className="font-[700] text-[18px] select-none flex items-center">
          {lyric.text}

          <button onClick={() => setIsEditing(true)} className="ml-1">
            <PencilSquareIcon className="w-5" />
          </button>
        </p>
      )}

      {!isEditing && isLast &&    <button
        className={`text-[18px] ${theme.content_hover_text}`}
        onClick={() => seek(lyric.start)}
      >
        {formatTime(lyric.end)}
      </button>}

      {isEditing && (
        <form action="" onSubmit={handleEdit}>
          <textarea
            onBlur={() => setIsEditing(false)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={textRef}
            className={classes.input}
          />
        </form>
      )}
    </div>
  );
}

export default AddLyricItem;
