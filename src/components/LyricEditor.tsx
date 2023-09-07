import { useEffect, useRef, useState } from "react";
import { Lyric, RealTimeLyric, Song, ThemeType } from "../types";
import LyricItem from "./ui/LyricItem";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Button from "./ui/Button";

type Props = {
  theme: ThemeType & { alpha: string };
  audioEle: HTMLAudioElement;
  lyric: Lyric;
  song: Song
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
    lyric ? lyric.realtime : []
  );

  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const end = useRef(0);
  const start = useRef(0);

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

      const previousLyricResult = realTimeLyrics.slice(0, currentLyricIndex - 1);

      setRealTimeLyrics(previousLyricResult);
      setCurrentLyricIndex(currentLyricIndex - 1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(realTimeLyrics));
  };

  const handleSetLyric = async () => {
    try {
      setLoading(true)
      console.log("lyric result", realTimeLyrics);
      await setDoc(
        doc(db, "lyrics", song.id),
        { realTime: realTimeLyrics, base: baseLyric },
        {
          merge: true,
        }
      );

      await setDoc(
         doc(db, "songs",  song.id),
         { lyric_id: song.id },
         {
           merge: true,
         }
       );

       setLoading(false)
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
        onClick={() => setOpenModal(true)}
        className={style.button}
      >
        {baseLyric ? "Change lyric" : "Add lyric"}
      </Button>
      <Button
        variant={"primary"}
        onClick={() => handlePlaySpeed(1)}
        className={style.button + (!isPlaying ? style.disable : "")}
      >
        <RocketLaunchIcon className="h-[20px] w-[20px] mr-[5px]" />
        Speed
      </Button>
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
          style.button + (!isClickPlay || !baseLyricArr.length ? style.disable : "")
        }
      >
        Add
      </Button>
      <Button
        variant={"primary"}
        onClick={removeLyric}
        className={
          style.button + (!isClickPlay || !baseLyricArr.length ? style.disable : "")
        }
      >
        Remove
      </Button>
      <Button
        onClick={handleCopy}
        variant={'primary'}
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
    }, [baseLyric]);

  //   console.log("check lyric data editor", realTimeLyrics);

  return (
    <>
      {ctaComponent}

      <div
        className={style.row + " h-[60vh] min-h-[200px] overflow-auto " + style.section}
      >
        <ul className={style.lyricBox + "min-w-[50%] max-w-[50%] pr-[20px]"}>
          {!!baseLyricArr.length ? (
            <>
              {baseLyricArr.map((lyric, index) => (
                <LyricItem
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
                <p className={theme.content_text}>
                  {lyric.start}s - {lyric.end}s
                </p>
              </li>
            ))}
        </ul>
      </div>

      <Button
      isLoading={loading}
        className={`${theme.content_bg} text-[14px] rounded-full mt-[20px]`}
        variant={"primary"}
        onClick={() => handleSetLyric()}
      >
        Save
      </Button>

      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <div
            className={`w-[700px] max-w-[90vw]  rounded-[8px] p-[20px] ${theme.side_bar_bg}`}
          >
            <textarea
              ref={textareaRef}
              className="w-full rounded-[4px] mb-[10px] min-h-[50vh] bg-transparent border text-white p-[10px]"
            />
            <Button variant={"primary"} onClick={() => handleAddBaseLyric()} className={style.button}>
              Save
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
