import { formatTime, getClasses } from "@/utils/appHelpers";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Ref, forwardRef } from "react";
import { LyricStatus } from "..";

type Props = {
  lyric: Lyric;
  seek: (time: number) => void;
  isLast: boolean;
  openModal: () => void;
  isPreview: boolean;
  activeColor: string;
  status: LyricStatus;
};

function AddLyricItem(
  { lyric, openModal, seek, isLast, status, activeColor, isPreview }: Props,
  ref: Ref<HTMLParagraphElement>,
) {
  const getClass = () => {
    switch (status) {
      case "active":
        return `${activeColor || "text-[#ffed00]"} active-lyric`;
      default:
        return "";
    }
  };

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
          ref={ref}
          className={`font-[700] select-none relative ${getClasses(!isPreview, "pr-6")} ${getClass()}`}
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

export default forwardRef(AddLyricItem);
