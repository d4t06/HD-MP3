import { useState } from "react";
import ModalHeader from "./ModalHeader";
import { useTheme } from "@/store";
import Button from "../ui/Button";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  PencilSquareIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useEditLyricModal from "@/hooks/useEditLyricModal";

type Props = {
  lyric: RealTimeLyric;
  closeModal: () => void;
  songUrl: string;
  index: number;
};

export default function EditLyricModal({ lyric, closeModal, songUrl, index }: Props) {
  const { theme } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    _play,
    status,
    endRefText,
    timeRangeRef,
    isEdit,
    setIsEdit,
    setEndPoint,
    audioRef,
    overlayRef,
    growList,
    words,
    handleGrowWord,
    textRef,
    handleUpdateLyricText,
  } = useEditLyricModal({
    lyric,
    index,
  });

  const renderItem = () => {
    return words.map((w, index) => (
      <Button
        style={{ flexGrow: growList[index] }}
        key={index}
        onClick={() => setCurrentIndex(index)}
        size={"clear"}
        className={`justify-center ${theme.side_bar_bg} border border-${theme.alpha} ${
          currentIndex === index ? theme.content_bg : ""
        }`}
      >
        {w}
      </Button>
    ));
  };

  const classes = {
    input: `bg-${theme.alpha} text-lg rounded-[4px] outline-none w-full px-2 py-1`,
    button: `${theme.content_bg} rounded-full`,
  };

  return (
    <>
      <audio ref={audioRef} src={songUrl} className="hidden"></audio>

      <div className="w-[500px] max-w-[90vw]">
        <ModalHeader close={closeModal} title="Edit lyric" />

        <div className="flex items-center space-x-2">
          <Button
            disabled={status === "playing"}
            onClick={_play}
            className={classes.button}
          >
            <PlayIcon className="w-6" />
          </Button>

          {isEdit ? (
            <>
              <Button onClick={() => setIsEdit(false)} className={classes.button}>
                <XMarkIcon className="w-6" />
              </Button>
              <Button onClick={handleUpdateLyricText} className={classes.button}>
                <CheckIcon className="w-6" />
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEdit(true)} className={classes.button}>
              <PencilSquareIcon className="w-6" />
            </Button>
          )}
        </div>

        <div className="flex items-center mt-3 space-x-2">
          <span>{lyric.start}</span>

          <input
            ref={timeRangeRef}
            type="range"
            min={lyric.start}
            max={lyric.end}
            step={0.1}
            className="w-full"
            onChange={(e) => setEndPoint(+e.target.value)}
          />

          <span ref={endRefText} className="flex-shrink-0 w-[100px] text-right">
            / {lyric.end}
          </span>
        </div>

        <div className="flex justify-center items-center space-x-2 mt-3">
          {isEdit ? (
            <form action="" onSubmit={handleUpdateLyricText}>
              <textarea ref={textRef} className={classes.input} />
            </form>
          ) : (
            <>
              <div className="relative text-2xl font-[700]">
                {lyric.text}
                <div
                  ref={overlayRef}
                  className="absolute top-0 left-0 overflow-hidden text-[#ffed00] whitespace-nowrap w-0"
                >
                  {lyric.text}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex h-[60px] mt-3">{renderItem()}</div>

        <div className="flex justify-center items-center space-x-3 mt-3">
          <Button
            disabled={growList[currentIndex] === 1}
            onClick={() => handleGrowWord("minus", currentIndex)}
            size={"clear"}
            className={`${theme.content_bg} px-2 rounded-full`}
          >
            <MinusIcon className="w-6" />
          </Button>
          <div className="text-xl">{growList[currentIndex]}</div>
          <Button
            onClick={() => handleGrowWord("plus", currentIndex)}
            size={"clear"}
            className={`${theme.content_bg} px-2 rounded-full`}
          >
            <PlusIcon className="w-6" />
          </Button>
        </div>

        <div className="text-right">
          <Button className={`${theme.content_bg} rounded-full mt-5`}>Ok</Button>
        </div>
      </div>
    </>
  );
}
