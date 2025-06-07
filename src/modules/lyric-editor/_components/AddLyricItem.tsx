import { formatTime, getClasses } from "@/utils/appHelpers";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

type Props = {
  lyric: Lyric;
  seek: (time: number) => void;
  isLast: boolean;
  openModal: () => void;
  isPreview: boolean;
};

function AddLyricItem({ lyric, openModal, seek, isLast, isPreview }: Props) {
  return (
    <>
      <div className="pt-[10px] last:mb-[30vh]">
        <button
          className={`text-[18px] hover:underline`}
          onClick={() => seek(lyric.start)}
        >
          {formatTime(+lyric.start)}
        </button>

        <p
          className={`font-[700] select-none relative ${getClasses(!isPreview, "pr-6")}`}
        >
          {lyric.text}

          {!isPreview && (
            <button onClick={openModal} className=" absolute mt-1 ml-1">
              <PencilSquareIcon className="w-5" />
            </button>
          )}
        </p>

        {isLast && lyric.end !== lyric.start && (
          <button className={`hover:underline pt-[10px]`} onClick={() => seek(lyric.end)}>
            {formatTime(+lyric.end)}
          </button>
        )}
      </div>
    </>
  );
}

export default AddLyricItem;
