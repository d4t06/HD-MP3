import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Lyric, ThemeType } from "../types";
import LyricItem from "./ui/LyricItem";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";

type Props = {
   audioEle: HTMLAudioElement;
   disable?: boolean;
   theme: ThemeType;
   lyricResult: Lyric[],
   setLyricResult: Dispatch<SetStateAction<Lyric[]>>,
   lyricParsed?: string;
   lyricsData?: { base: string; realtime: Lyric[] };
};

export default function LyricEditor({
   audioEle,
   theme,
   disable,
   lyricParsed,
   lyricsData,
   lyricResult,
   setLyricResult,
}: Props) {
   const [isPlaying, setIsPlaying] = useState(false);
   const [isClickPlay, setIsClickPlay] = useState(false);

   const [lyricString, SetLyricString] = useState<string>("");
   const [lyricArr, setLyricArr] = useState<string[]>([]);

   const [openModal, setOpenModal] = useState(false);

   const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);

   const textareaRef = useRef<HTMLTextAreaElement>(null)
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

      if (!textareaRef.current) return
      const target = textareaRef.current as HTMLTextAreaElement
      SetLyricString(target.value)
      setOpenModal(false);
   }

   const addLyric = () => {
      // if song no has lyric
      if (!lyricArr.length) return;

      // if end of the song
      if (currentLyricIndex >= lyricArr.length) return;

      // if start time and end time is equal
      if ((start.current == +audioEle.currentTime.toFixed(1))) return;

      if (audioEle) {
         end.current = +audioEle.currentTime.toFixed(1);
         const lyric = lyricArr[currentLyricIndex];

         const result: Lyric = {
            start: start.current,
            text: lyric,
            end: end.current,
         };

         start.current = end.current;

         setLyricResult([...lyricResult, result]);
         setCurrentLyricIndex(currentLyricIndex + 1);
      }
   };

   const removeLyric = () => {
      if (currentLyricIndex <= 0) return;

      if (audioEle) {
         start.current = lyricResult[currentLyricIndex - 1].start;
         end.current = 0;

         const previousLyricResult = lyricResult.slice(0, currentLyricIndex - 1);

         setLyricResult(previousLyricResult);
         setCurrentLyricIndex(currentLyricIndex - 1);
      }
   };

   const handleCopy = () => {
      navigator.clipboard.writeText(JSON.stringify(lyricResult));
   };

   const style = {
      row: "flex justify-between gap-[20px]",
      col: "flex-grow flex flex-col gap-[20px]",
      formGroup: "flex flex-col gap-[5px] flex-grow",
      label: "text-md font-[500]",
      button:
         theme.content_bg +
         " rounded-[8px] py-[5px] px-[20px] flex justify-center items-center hover:brightness-75",
      disable: " opacity-60 pointer-events-none ",
      icon: "h-[20px] w-[20px]",
      lyricBox: "list-none border-r h-full max-[549px]:w-[100%]",
   };

   useEffect(() => {
      const lyric = lyricParsed || lyricString;
      const filteredLyric = lyric.split(/\r?\n/).filter((lyric) => lyric);
      setLyricArr(filteredLyric);
   }, [lyricParsed, lyricString]);

   console.log("check lyric data editor", lyricsData);

   return (
      <>
         <div className="flex gap-[20px] mb-[20px]">
            <button
               type="button"
               onClick={() => setOpenModal(true)}
               className={style.button}
            >
               {lyricString ?  'Change lyric' : 'Add lyric'}
            </button>
            <button
               type="button"
               onClick={() => handlePlaySpeed(1)}
               className={style.button + (!isPlaying ? style.disable : "")}
            >
               <RocketLaunchIcon className="h-[20px] w-[20px] mr-[5px   ]" />
               Speed
            </button>
            <button
               type="button"
               onClick={() => handlePlaySpeed(1.2)}
               className={style.button + (!isPlaying ? style.disable : "")}
            >
               1.2x
            </button>
            <button
               type="button"
               onClick={() => handlePlaySpeed(1.5)}
               className={style.button + (!isPlaying ? style.disable : "")}
            >
               1.5x{" "}
            </button>
            <button
               type="button"
               onClick={() => play()}
               className={style.button + (isPlaying ? style.disable : "")}
            >
               Play
            </button>
            <button
               type="button"
               onClick={() => pause()}
               className={style.button + (!isClickPlay ? style.disable : "")}
            >
               Pause
            </button>
            <button
               type="button"
               onClick={() => addLyric()}
               className={style.button + (!isClickPlay ? style.disable : "")}
            >
               Add
            </button>
            <button
               type="button"
               onClick={() => removeLyric()}
               className={style.button + (!isClickPlay ? style.disable : "")}
            >
               Remove
            </button>
            <button
               onClick={() => handleCopy()}
               type="button"
               className={style.button + (!isClickPlay ? style.disable : "")}
            >
               Copy
            </button>
         </div>
         <div className={style.row + " h-[200px] overflow-auto"}>
            {/* <div className={style.formGroup}> */}
            {/* <h5 className={style.label}>Base lyric</h5> */}
            <ul className={style.lyricBox + "min-w-[50%] max-w-[50%] pr-[20px]"}>
               {!!lyricArr.length &&
                  lyricArr.map((lyric, index) => (
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
            </ul>

            <ul className={style.lyricBox + " border-none w-[50%]"}>
               {!!lyricResult?.length &&
                  lyricResult.map((lyric, index) => (
                     <li key={index} className="mb-[5px] pt-[10px]">
                        <p className="text-[16px] font-bold">{lyric.text}</p>
                        <p className={theme.content_text}>
                           {lyric.start} - {lyric.end}
                        </p>
                     </li>
                  ))}
            </ul>
         </div>

         {openModal && (
            <Modal setOpenModal={setOpenModal}>
               <div className={`w-[700px] max-w-[90vw]  rounded-[8px] p-[20px] ${theme.side_bar_bg}`}>
                  <textarea ref={textareaRef} className="w-full min-h-[50vh] bg-transparent border text-white p-[10px]"/>
                  <button onClick={() =>handleAddBaseLyric()} className={style.button}>Save</button>
               </div>
            </Modal>
         )}
      </>
   );
}
