import { useEffect, useRef, useState } from "react";
import { Lyric, RealTimeLyric, Song, ThemeType } from "../types";
import {
  FloatingFocusManager,
  autoUpdate,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import Modal from "./Modal";
import LyricItem from "./child/LyricItem";
import Button from "./ui/Button";

import PopupWrapper from "./ui/PopupWrapper";

type Props = {
  theme: ThemeType & { alpha: string };
  audioEle: HTMLAudioElement;
  lyric: Lyric;
  song: Song;
};

export default function LyricEditor({
  audioEle,
  theme,
  song,

  lyric,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClickPlay, setIsClickPlay] = useState(false);

  const [baseLyric, setBaseLyric] = useState<string>(lyric ? lyric.base : "");
  const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
  const [realTimeLyrics, setRealTimeLyrics] = useState<RealTimeLyric[]>(
    lyric ? lyric.real_time : []
  );

  const [openSpeedSetting, setOpenSpeedSetting] = useState(false);
  const [playSpeed, setPlayspeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(
    realTimeLyrics ? realTimeLyrics.length : 0
  );

  const firstTimeRender = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const end = useRef(0);
  const start = useRef(0);

  const { refs, floatingStyles, context } = useFloating({
    open: openSpeedSetting,
    onOpenChange: setOpenSpeedSetting,
    placement: "bottom-start",
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const play = () => {
    if (audioEle) {
      audioEle.play();
      setIsPlaying(true);
      setIsClickPlay(true);
    }
  };
  const pause = () => {
    if (audioEle) {
      audioEle.pause();
      setIsPlaying(false);
    }
  };
  const handlePlaySpeed = (speed: number) => {
    if (audioEle) {
      audioEle.playbackRate = speed;
      setPlayspeed(speed);
    }
  };

  const handleAddBaseLyric = () => {
    if (!textareaRef.current) return;
    const target = textareaRef.current as HTMLTextAreaElement;
    setBaseLyric(target.value);
    setOpenModal(false);
  };

  const addLyric = () => {
    // if song no has lyric
    if (!baseLyricArr.length) return;

    // if end of the song
    if (currentLyricIndex >= baseLyricArr.length) return;

    // if start time and end time is equal
    if (start.current == +audioEle.currentTime.toFixed(1)) return;

    if (audioEle) {
      end.current = +audioEle.currentTime.toFixed(1);
      const lyric = baseLyricArr[currentLyricIndex];

      const result: RealTimeLyric = {
        start: start.current,
        text: lyric,
        end: end.current,
      };

      start.current = end.current;

      setRealTimeLyrics([...realTimeLyrics, result]);
      setCurrentLyricIndex(currentLyricIndex + 1);
    }
  };

  const removeLyric = () => {
    if (currentLyricIndex <= 0) return;

    if (audioEle) {
      start.current = realTimeLyrics[currentLyricIndex - 1].start;
      end.current = 0;

      const previousLyricResult = realTimeLyrics.slice(
        0,
        currentLyricIndex - 1
      );

      setRealTimeLyrics(previousLyricResult);
      setCurrentLyricIndex(currentLyricIndex - 1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(realTimeLyrics));
  };

  const handleSetLyricToDb = async () => {
    try {
      setLoading(true);
      console.log("lyric result", realTimeLyrics);
      await setDoc(
        doc(db, "lyrics", song.id),
        { real_time: realTimeLyrics, base: baseLyric },
        {
          merge: true,
        }
      );

      await setDoc(
        doc(db, "songs", song.id),
        { lyric_id: song.id },
        {
          merge: true,
        }
      );

      setLoading(false);
    } catch (error) {
      console.log({ message: error });
    }
  };

  const style = {
    section: `bg-${theme.alpha} py-[10px] px-[20px] rounded-[12px] mb-[30px] w-full`,
    row: "flex no-scrollbar justify-between gap-[20px]",
    col: "flex-grow flex flex-col gap-[20px]",
    formGroup: "flex flex-col gap-[5px] flex-grow",
    label: "text-md font-[500]",
    button: `${theme.content_bg} rounded-full text-white text-[14px]`,
    disable: " opacity-60 pointer-events-none ",
    icon: "h-[20px] w-[20px]",
    lyricBox: "list-none h-full max-[549px]:w-[100%]",
  };

  const ctaComponent = (
    <div className="flex gap-[20px] mb-[20px]">
      <Button
        variant={"primary"}
        ref={refs.setReference}
        onClick={() => setOpenModal(true)}
        className={style.button}
      >
        {baseLyric ? "Change lyric" : "Add lyric"}
      </Button>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={
          style.button +
          "  inline-flex items-center hover:brightness-90 px-[20px] py-[5px] text-[14px] bg-[#ca4954] rounded-full text-white text-[14px]"
        }
      >
        <RocketLaunchIcon className="h-[20px] w-[20px] mr-[5px]" />
        Speed
      </button>
      {isPlaying ? (
        <Button
          variant={"primary"}
          onClick={pause}
          className={style.button + (!isClickPlay ? style.disable : "")}
        >
          Pause
        </Button>
      ) : (
        <Button
          variant={"primary"}
          onClick={play}
          className={style.button + (isPlaying ? style.disable : "")}
        >
          Play
        </Button>
      )}

      <Button
        variant={"primary"}
        onClick={addLyric}
        className={
          style.button +
          (!isClickPlay || !baseLyricArr.length ? style.disable : "")
        }
      >
        Add
      </Button>
      <Button
        variant={"primary"}
        onClick={removeLyric}
        className={
          style.button +
          (!isClickPlay || !baseLyricArr.length ? style.disable : "")
        }
      >
        Remove
      </Button>
      <Button
        onClick={handleCopy}
        variant={"primary"}
        className={style.button + (!isClickPlay ? style.disable : "")}
      >
        Copy
      </Button>
    </div>
  );

  useEffect(() => {
    if (baseLyric) {
      const filteredLyric = baseLyric.split(/\r?\n/).filter((lyric) => lyric);
      setBaseLyricArr(filteredLyric);

    }

    if (baseLyricArr.length && firstTimeRender.current) firstTimeRender.current = false;

    console.log("check firstTimeRender", firstTimeRender.current);
    

  }, [baseLyric]);

  useEffect(() => {
    if (realTimeLyrics.length) {
      const lastestTime = realTimeLyrics[realTimeLyrics.length - 1].end;

      audioEle.currentTime = lastestTime;
      start.current = lastestTime;
    }

  }, []);

  //   console.log("check lyric data editor", realTimeLyrics);

  const classes = {
    listItem: `w-full cursor-pointer py-[2px] ${theme.content_hover_text}`,
  };

  return (
    <>
      {ctaComponent}

      <div
        className={
          style.row + " h-[60vh] min-h-[200px] overflow-auto " + style.section
        }
      >
        <ul className={style.lyricBox + "min-w-[50%] max-w-[50%] pr-[20px]"}>
          {!!baseLyricArr.length ? (
            <>
              {baseLyricArr.map((lyric, index) => (
                <LyricItem
                  firstTimeRender={firstTimeRender.current}
                  className="mb-[19px]"
                  key={index}
                  inUpload
                  active={index === currentLyricIndex}
                  done={index != currentLyricIndex}
                >
                  {lyric}
                </LyricItem>
              ))}
            </>
          ) : (
            <h1>Base lyric...</h1>
          )}
        </ul>

        <ul className={style.lyricBox + " border-none w-[50%]"}>
          {!!realTimeLyrics?.length &&
            realTimeLyrics.map((lyric, index) => (
              <li key={index} className="mb-[5px] pt-[10px]">
                <p className="text-[16px] font-bold">{lyric.text}</p>
                <div className="flex gap-[10px]">
                  <button
                    className={` ${theme.content_hover_text}`}
                    onClick={() => (audioEle.currentTime = lyric.start)}
                  >
                    {lyric.start}s
                  </button>
                  <span> - </span>
                  <button
                    className={` ${theme.content_hover_text}`}
                    onClick={() => (audioEle.currentTime = lyric.end)}
                  >
                    {lyric.end}s
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <Button
        isLoading={loading}
        className={`${theme.content_bg} text-[14px] rounded-full mt-[20px]`}
        variant={"primary"}
        onClick={() => handleSetLyricToDb()}
      >
        Save
      </Button>

      {openSpeedSetting && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="z-[99]"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <PopupWrapper theme={theme}>
              <ul className="w-[100px] text-center text-[14px]">
                <li
                  onClick={() => handlePlaySpeed(1)}
                  className={`
                  ${playSpeed === 1 && theme.content_text} 
                  ${classes.listItem}`}
                >
                  1x
                </li>
                <li
                  onClick={() => handlePlaySpeed(1.2)}
                  className={`
                  ${playSpeed === 1.2 && theme.content_text}
                  ${classes.listItem}`}
                >
                  1.2x
                </li>
                <li
                  onClick={() => handlePlaySpeed(1.5)}
                  className={`
                  ${playSpeed === 1.5 && theme.content_text}
                  ${classes.listItem}`}
                >
                  1.5x
                </li>
              </ul>
            </PopupWrapper>
          </div>
        </FloatingFocusManager>
      )}

      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <div
            className={`w-[700px] max-w-[90vw]  rounded-[8px] p-[20px] ${theme.side_bar_bg}`}
          >
            <textarea
              ref={textareaRef}
              value={baseLyric}
              onChange={e => setBaseLyric(e.target.value)}
              className="w-full rounded-[4px] mb-[10px] min-h-[50vh] bg-transparent border text-[#333] p-[10px]"
            />
            <Button
              variant={"primary"}
              onClick={() => handleAddBaseLyric()}
              className={style.button}
            >
              Save
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
