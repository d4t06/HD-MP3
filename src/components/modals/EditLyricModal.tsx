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
    tempWordRef,
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
    updateLyricTune,
  } = useEditLyricModal({
    lyric,
    index,
  });

  const handleUpdateLyricTune = () => {
    updateLyricTune();
    closeModal();
  };

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

      <div className="max-w-[90vw]">
        <ModalHeader close={closeModal} title="Edit lyric" />

        <div ref={tempWordRef} className="inline-block opacity-0">
          {words.map((w, i) => (
            <span className="leading-[1] inline-block" key={i}>
              {w}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 mt-[-20px]">
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

        <div className="flex text-xl items-center mt-3 space-x-2">
          <span className="flex-shrink-0">Start: {lyric.start}</span>

          <input
            ref={timeRangeRef}
            type="range"
            min={lyric.start}
            max={lyric.end}
            step={0.1}
            className="w-full"
            onChange={(e) => setEndPoint(+e.target.value)}
          />

          <span className="flex-shrink-0 w-[170px]">
            End:
            <span ref={endRefText}>/ {lyric.end}</span>
          </span>
        </div>

        <div className="flex justify-center items-center space-x-2 mt-3">
          {isEdit ? (
            <form action="" onSubmit={handleUpdateLyricText}>
              <textarea ref={textRef} className={classes.input} />
            </form>
          ) : (
            <>
              <div className="relative whitespace-nowrap text-2xl font-[700]">
                {lyric.text}
                <div
                  ref={overlayRef}
                  className="absolute  top-0 left-0 overflow-hidden text-[#ffed00] whitespace-nowrap w-0"
                >
                  {lyric.text}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex h-[60px] mt-3">{renderItem()}</div>

        <div className="flex items-center mt-3">
          <input
            type="range"
            min={1}
            max={30}
            step={0.2}
            className="w-full"
            value={growList[currentIndex] + ""}
            onChange={(e) =>
              handleGrowWord({
                variant: "range",
                value: +e.target.value,
                index: currentIndex,
              })
            }
          />

          <div className="text-xl w-[140px] ml-2 leading-[1]">
            Grow: {growList[currentIndex]}
          </div>
        </div>

        <div className="flex justify-center items-center space-x-3 mt-3">
          <Button
            disabled={growList[currentIndex] === 1}
            onClick={() =>
              handleGrowWord({ variant: "button", action: "minus", index: currentIndex })
            }
            size={"clear"}
            className={`${theme.content_bg} px-2 rounded-full`}
          >
            <MinusIcon className="w-6" />
          </Button>
          <Button
            onClick={() =>
              handleGrowWord({ variant: "button", action: "plus", index: currentIndex })
            }
            size={"clear"}
            className={`${theme.content_bg} px-2 rounded-full`}
          >
            <PlusIcon className="w-6" />
          </Button>
        </div>

        <div className="text-right">
          <Button
            onClick={handleUpdateLyricTune}
            className={`${theme.content_bg} font-playwriteCU rounded-full mt-5`}
          >
            Ok
          </Button>
        </div>
      </div>
    </>
  );
}
