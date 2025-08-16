import { formatTime } from "@/utils/appHelpers";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Ref, forwardRef } from "react";
import { LyricStatus } from "..";
import { TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  lyric: Lyric;
  seek: (time: number) => void;
  removeLyric: () => void;
  isLast: boolean;
  openModal: () => void;
  isPreview: boolean;
  activeColor: string;
  status: LyricStatus;
};

function AddLyricItem(
  { lyric, openModal, seek, isLast, status, isPreview, removeLyric }: Props,
  ref: Ref<HTMLParagraphElement>,
) {
  const getClass = () => {
    switch (status) {
      case "active":
        return `${"text-[--primary-cl] dark:text-[#ffed00]"} active-lyric`;
      default:
        return "";
    }
  };

  return (
    <>
      <div className="pt-[10px] last:mb-[30vh]">
        <div
          className={`flex ${isPreview ? "justify-center" : ""}  space-x-1.5 mb-[3px]`}
        >
          <button
            className={`hover:underline item-info`}
            onClick={() => seek(lyric.start)}
          >
            {formatTime(+lyric.start)}
          </button>

          {!isPreview && (
            <button onClick={openModal} className="">
              <PencilSquareIcon className="w-5" />
            </button>
          )}

          <button onClick={removeLyric} className="">
            <TrashIcon className="w-5" />
          </button>
        </div>

        <p
          ref={ref}
          className={`font-[700] select-none relative ${getClass()}`}
        >
          {lyric.text}
        </p>

        {isLast && lyric.end !== lyric.start && (
          <button
            className={`hover:underline pt-[10px]`}
            onClick={() => seek(lyric.end)}
          >
            {formatTime(+lyric.end)}
          </button>
        )}
      </div>
    </>
  );
}

export default forwardRef(AddLyricItem);
