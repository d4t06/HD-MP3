import { formatTime } from "@/utils/appHelpers";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

type Props = {
  lyric: RealTimeLyric;
  seek: (time: number) => void;
  theme: ThemeType & { alpha: string };
  isLast: boolean;
  openModal: () => void;
};

function AddLyricItem({ lyric, openModal, seek, theme, isLast }: Props) {
  return (
    <>
      <div className="pt-[10px] last:mb-[30vh]">
        <button
          className={`text-[18px] ${theme.content_hover_text}`}
          onClick={() => seek(lyric.start)}
        >
          {formatTime(+lyric.start)}
        </button>

        <p className="font-[700] select-none flex items-center">
          {lyric.text}

          <button onClick={openModal} className="ml-1">
            <PencilSquareIcon className="w-5" />
          </button>
        </p>

        {isLast && (
          <button
            className={`${theme.content_hover_text}`}
            onClick={() => seek(lyric.start)}
          >
            {formatTime(lyric.end)}
          </button>
        )}
      </div>
    </>
  );
}

export default AddLyricItem;
