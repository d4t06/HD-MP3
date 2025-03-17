import { ElementRef, useEffect, useRef, useState } from "react";
import { useThemeContext } from "@/stores";
import {
  BackwardIcon,
  CheckIcon,
  ForwardIcon,
  PauseIcon,
  PencilSquareIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useEditLyricModal from "../_hooks/useEditLyricModal";
import { useEditLyricContext } from "@/stores/EditLyricContext";
import { AudioSetting, Button, ModalHeader } from "@/components";

type Props = {
  closeModal: () => void;
};

export default function EditLyricModal({ closeModal }: Props) {
  const { theme } = useThemeContext();
  const { setSelectLyricIndex, selectLyricIndex, lyrics, song } = useEditLyricContext();

  const [currentIndex, setCurrentIndex] = useState(0);

  const growInputRef = useRef<ElementRef<"input">>(null);

  const {
    handlePlayPause,
    status,
    pause,
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
    endTimeRangeProps,
    currentLyric,
    setIsChangeTune,
  } = useEditLyricModal();

  const handleUpdateLyricTune = () => {
    updateLyricTune();
    closeModal();
  };

  const handleSelectWord = (i: number) => {
    setCurrentIndex(i);

    setIsChangeTune(true);

    growInputRef.current?.focus();
  };

  const handleNavigate = (action: "next" | "prev") => {
    if (typeof selectLyricIndex !== "number") return;

    if (refs.isChanged.current) {
      refs.isChanged.current = false;
      updateLyricTune();
    }

    pause();

    switch (action) {
      case "next":
        if (selectLyricIndex === lyrics.length - 1) return;

        setSelectLyricIndex((prev) => prev! + 1);
        break;
      case "prev":
        if (selectLyricIndex === 0) return;

        setSelectLyricIndex((prev) => prev! - 1);
        break;
    }
  };

  const renderItem = () => {
    return words.map((w, index) => {
      const isActive = currentIndex === index;

      return (
        <Button
          style={{ flexGrow: growList[index] }}
          key={index}
          ref={(el) => (isActive ? (refs.currentWordRef.current = el) : {})}
          onClick={() => handleSelectWord(index)}
          size={"clear"}
          className={`word-item justify-center border ${theme.content_border} ${
            isActive ? theme.content_bg : "bg-" + theme.alpha
          }`}
        >
          {w}
        </Button>
      );
    });
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

  useEffect(() => {
    if (refs.textRef.current) refs.textRef.current.value = currentLyric.text;
  }, [isEdit]);

  return (
    <>
      <audio ref={refs.audioRef} src={song?.song_url} className="hidden"></audio>

      <div className="max-w-[90vw] w-[600px]">
        <ModalHeader close={closeModal} title="Edit lyric" />

        {/* temp words */}
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

          {refs.audioRef.current && (
            <AudioSetting
              audioEle={refs.audioRef.current}
              postLocalStorageKey="edit_lyric_tune"
            />
          )}

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
          <label htmlFor="start" className="flex-shrink-0 w-[150px]">
            Start:&nbsp;
            <span ref={refs.startRefText}></span>
          </label>

          <input
            ref={refs.startTimeRangeRef}
            type="range"
            id="start"
            min={currentLyric.start}
            max={currentLyric.end}
            step={0.2}
            className="w-full"
            onChange={(e) => setStartPoint(+e.target.value)}
          />
        </div>

        <div className="flex items-center mt-3 space-x-2">
          <label htmlFor="end" className="flex-shrink-0 w-[150px]">
            End:&nbsp;
            <span ref={refs.endRefText}></span>
          </label>

          <input
            id="end"
            ref={refs.endTimeRangeRef}
            type="range"
            min={currentLyric.start}
            step={0.2}
            className="w-full"
            onChange={(e) => setEndPoint(+e.target.value)}
            {...endTimeRangeProps}
          />
        </div>

        <div className="flex items-center mt-3">
          <label htmlFor="grow" className="flex-shrink-0 w-[150px] mr-2 leading-[1]">
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
              <div className="relative whitespace-nowrap  sm:text-2xl font-[700]">
                {currentLyric.text}
                <div
                  ref={refs.overlayRef}
                  className="absolute  top-0 left-0 overflow-hidden text-[#ffed00] whitespace-nowrap w-0"
                >
                  {currentLyric.text}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex h-[60px] mt-3">{renderItem()}</div>

        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => handleNavigate("prev")}
            className={`${theme.content_bg} font-playwriteCU space-x-1 rounded-full mt-5`}
          >
            <BackwardIcon className="w-6" />
            <span>Previous</span>
          </Button>
          <Button
            onClick={() => handleNavigate("next")}
            className={`${theme.content_bg} font-playwriteCU space-x-1 rounded-full mt-5`}
          >
            <span>Next</span>
            <ForwardIcon className="w-6" />
          </Button>
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
