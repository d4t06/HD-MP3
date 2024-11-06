import { formatTime } from "@/utils/appHelpers";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useRef, useState, FormEvent, useEffect, ElementRef } from "react";
import Modal, { ModalRef } from "../Modal";
import EditLyricModal from "../modals/EditLyricModal";

type Props = {
  lyric: RealTimeLyric;
  seek: (time: number) => void;
  theme: ThemeType & { alpha: string };
  isLast: boolean;
  songUrl: string;
  index: number;
};

function AddLyricItem({ lyric, seek, theme, isLast, songUrl, index }: Props) {
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  // const handleEdit = (e: FormEvent) => {
  //   e.preventDefault();

  //   updateLyric(text);
  //   setIsEditing(false);
  // };

  // const classes = {
  //   input: `bg-${theme.alpha} text-lg rounded-[4px] outline-none w-full px-2 py-1`,
  // };

  // useEffect(() => {
  //   if (isEditing) {
  //     textRef.current?.focus();
  //   }
  // }, [isEditing]);

  return (
    <>
      <div className="pt-[10px] last:mb-[30vh]">
        <button
          className={`text-[18px] ${theme.content_hover_text}`}
          onClick={() => seek(lyric.start)}
        >
          {formatTime(lyric.start)}
        </button>

        <p className="font-[700] text-[18px] select-none flex items-center">
          {lyric.text}

          <button onClick={() => modalRef.current?.open()} className="ml-1">
            <PencilSquareIcon className="w-5" />
          </button>
        </p>

        {isLast && (
          <button
            className={`text-[18px] ${theme.content_hover_text}`}
            onClick={() => seek(lyric.start)}
          >
            {formatTime(lyric.end)}
          </button>
        )}

        {/* {isEditing && (
          <form action="" onSubmit={handleEdit}>
            <textarea
              onBlur={() => setIsEditing(false)}
              value={text}
              onChange={(e) => setText(e.target.value)}
              ref={textRef}
              className={classes.input}
            />
          </form>
        )} */}
      </div>

      <Modal variant="animation" ref={modalRef}>
        <EditLyricModal
          index={index}
          songUrl={songUrl}
          closeModal={closeModal}
          lyric={lyric}
        />
      </Modal>
    </>
  );
}

export default AddLyricItem;
