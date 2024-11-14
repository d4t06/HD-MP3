import { ElementRef, useRef, useState } from "react";
import ModalHeader from "./ModalHeader";
import { useTheme } from "@/store";
import Button from "../ui/Button";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  PauseIcon,
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

  const growInputRef = useRef<ElementRef<"input">>(null);

  const {
    handlePlayPause,
    status,
    setStartPoint,
    refs,
    isEdit,
    setIsEdit,
    setEndPoint,
    growList,
    words,
    handleGrowWord,
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

  const handleWordList = (i: number) => {
    setCurrentIndex(i);

    growInputRef.current?.focus();
  };

  const renderItem = () => {
    return words.map((w, index) => (
      <Button
        style={{ flexGrow: growList[index] }}
        key={index}
        onClick={() => handleWordList(index)}
        size={"clear"}
        className={`justify-center ${theme.side_bar_bg} border border-${theme.alpha} ${
          currentIndex === index ? theme.content_bg : ""
        }`}
      >
        {w}
      </Button>
    ));
  };

  const renderIcon = () => {
    switch (status) {
      case "playing":
        return <PauseIcon className="w-6" />;
      case "paused":
        return <PlayIcon className="w-6" />;
    }
  };
  const classes = {
    input: `bg-${theme.alpha} text-lg rounded-[4px] outline-none w-full px-2 py-1`,
    button: `${theme.content_bg} rounded-full`,
  };

  return (
    <>
      <audio ref={refs.audioRef} src={songUrl} className="hidden"></audio>

      <div className="max-w-[90vw] min-w-[400px]">
        <ModalHeader close={closeModal} title="Edit lyric" />

        <div ref={refs.tempWordRef} className="inline-block opacity-0">
          {words.map((w, i) => (
            <span className="leading-[1] inline-block" key={i}>
              {w}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 mt-[-20px]">
          <Button onClick={handlePlayPause} className={classes.button}>
            {renderIcon()}
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

        <div className="flex items-center mt-5 space-x-2">
          <label htmlFor="start" className="flex-shrink-0 w-[140px]">
            Start:&nbsp;
            <span ref={refs.startRefText}></span>
          </label>

          <input
            ref={refs.startTimeRangeRef}
            type="range"
            id="start"
            min={lyric.start}
            max={lyric.end}
            step={0.2}
            className="w-full"
            onChange={(e) => setStartPoint(+e.target.value)}
          />
        </div>

        <div className="flex items-center mt-3 space-x-2">
          <label htmlFor="end" className="flex-shrink-0 w-[140px]">
            End:&nbsp;
            <span ref={refs.endRefText}></span>
          </label>

          <input
            id="end"
            ref={refs.endTimeRangeRef}
            type="range"
            min={lyric.start}
            step={0.2}
            className="w-full"
            onChange={(e) => setEndPoint(+e.target.value)}
          />
        </div>

        <div className="flex items-center mt-3">
          <label htmlFor="grow" className="flex-shrink-0 w-[140px] mr-2 leading-[1]">
            Grow: {growList[currentIndex]}
          </label>
          <input
            ref={growInputRef}
            type="range"
            id="grow"
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
        </div>

        <div className="flex justify-center items-center space-x-2 mt-5">
          {isEdit ? (
            <form action="" onSubmit={handleUpdateLyricText}>
              <textarea ref={refs.textRef} className={classes.input} />
            </form>
          ) : (
            <>
              <div className="relative whitespace-nowrap text-2xl font-[700]">
                {lyric.text}
                <div
                  ref={refs.overlayRef}
                  className="absolute  top-0 left-0 overflow-hidden text-[#ffed00] whitespace-nowrap w-0"
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
