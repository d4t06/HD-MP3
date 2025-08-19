import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Ref, forwardRef } from "react";
import { LyricStatus, editLyricFormatTime } from "..";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ViewMode } from "./EditLyricContext";

type Props = {
  lyric: Lyric;
  seek: (time: number) => void;
  removeLyric: () => void;
  isLast: boolean;
  openModal: () => void;
  viewMode: ViewMode;
  activeColor: string;
  status: LyricStatus;
};



function AddLyricItem(
  { lyric, openModal, seek, isLast, status, viewMode, removeLyric }: Props,
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
      <div className="pt-3 last:mb-[30vh]">
        <div
          className={`flex ${viewMode !== "edit" ? "justify-center" : ""}  space-x-1.5 mb-1`}
        >
          <button
            className={`hover:underline item-info`}
            onClick={() => seek(lyric.start)}
          >
            {editLyricFormatTime(+lyric.start)}
          </button>

          <button onClick={openModal} className="">
            <PencilSquareIcon className="w-5" />
          </button>

          {viewMode === "import" && (
            <>
              <button onClick={removeLyric} className="">
                <TrashIcon className="w-5" />
              </button>
            </>
          )}
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
            {editLyricFormatTime(+lyric.end)}
          </button>
        )}
      </div>
    </>
  );
}

export default forwardRef(AddLyricItem);
