import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lyric, RealTimeLyric, Song, ThemeType } from "../types";
import { FloatingFocusManager, autoUpdate, offset, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

import { Modal, LyricItem, Button, PopupWrapper } from "../components";

import { mySetDoc } from "../utils/firebaseHelpers";
import { setSong, useSongsStore, useToast } from "../store";
import { updateSongsListValue } from "../utils/appHelpers";
import { useDispatch } from "react-redux";

type Props = {
   theme: ThemeType & { alpha: string };
   audioRef: RefObject<HTMLAudioElement>;
   lyric: Lyric;
   song: Song;
};

export default function LyricEditor({
   audioRef,
   theme,
   song,

   lyric,
}: Props) {
   const dispatch = useDispatch();
   const { userSongs, setUserSongs } = useSongsStore();
   const { setSuccessToast, setErrorToast } = useToast();

   const [isPlaying, setIsPlaying] = useState(false);
   const [isClickPlay, setIsClickPlay] = useState(false);

   const [baseLyric, setBaseLyric] = useState<string>(lyric ? lyric.base : "");
   const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
   const [realTimeLyrics, setRealTimeLyrics] = useState<RealTimeLyric[]>(lyric ? lyric.real_time : []);

   const [openSpeedSetting, setOpenSpeedSetting] = useState(false);
   const [playSpeed, setPlayspeed] = useState(1);
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(realTimeLyrics ? realTimeLyrics.length : 0);

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
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

   const isFinish = useMemo(() => {
      return realTimeLyrics.length >= baseLyricArr.length;
   }, [baseLyricArr, realTimeLyrics, isClickPlay]);

   const isNearFinish = useMemo(() => {
      return realTimeLyrics.length === baseLyricArr.length - 1;
   }, [baseLyricArr, realTimeLyrics, isClickPlay]);

   const play = () => {
      const audioEle = audioRef.current;
      if (audioEle) {
         audioEle.play();
         setIsPlaying(true);
         setIsClickPlay(true);
      }
   };
   const pause = () => {
      const audioEle = audioRef.current;

      if (audioEle) {
         audioEle.pause();
         setIsPlaying(false);
      }
   };
   const handlePlaySpeed = (speed: number) => {
      const audioEle = audioRef.current;

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

   const handleSetTime = (time: number) => {
      const audioEle = audioRef.current;
      if (audioEle) {
         audioEle.currentTime = time;
      }
   };

   const addLyric = useCallback(() => {
      // if song no has lyric
      if (!baseLyricArr.length) return;

      const audioEle = audioRef.current;
      if (!audioEle) return;

      // if end of the song
      if (isFinish) return;

      // if start time and end time is equal
      if (start.current == +audioEle.currentTime.toFixed(1)) return;

      // when near end, end when update in handleSongEnd
      if (!audioEle.ended) {
         if (isNearFinish) end.current = +audioEle.duration.toFixed(1);
         else end.current = +audioEle.currentTime.toFixed(1);
      }

      const lyric = baseLyricArr[currentLyricIndex];

      const result: RealTimeLyric = {
         start: start.current,
         text: lyric,
         end: end.current,
      };

      start.current = end.current;

      setRealTimeLyrics([...realTimeLyrics, result]);
      setCurrentLyricIndex(currentLyricIndex + 1);
   }, [baseLyricArr, currentLyricIndex]);

   const removeLyric = () => {
      if (currentLyricIndex <= 0) return;
      const audioEle = audioRef.current;

      if (audioEle) {
         start.current = realTimeLyrics[currentLyricIndex - 1].start;
         end.current = 0;

         const previousLyricResult = realTimeLyrics.slice(0, currentLyricIndex - 1);

         setRealTimeLyrics(previousLyricResult);
         setCurrentLyricIndex(currentLyricIndex - 1);
      }
   };

   const handleSetLyricToDb = async () => {
      try {
         setLoading(true);

         await mySetDoc({
            collection: "lyrics",
            data: { real_time: realTimeLyrics, base: baseLyric },
            id: song.id,
         });

         const newSong: Song = { ...song, lyric_id: song.id };
         const newUserSongs = [...userSongs];

         const index = updateSongsListValue(newSong, newUserSongs);

         if (!index) {
            setErrorToast({ message: "No song found" });
            return;
         }

         setUserSongs(newUserSongs);

         await mySetDoc({ collection: "songs", data: { lyric_id: song.id }, id: song.id });

         dispatch(setSong({ ...newSong, currentIndex: index, song_in: "user" }));

         // finish
         setSuccessToast({ message: "Add lyric successful" });
         setLoading(false);
      } catch (error) {
         console.log({ message: error });
      }
   };

   const handleSongEnd = () => {
      const audioEle = audioRef.current as HTMLAudioElement;


      
      console.log("check ", realTimeLyrics.length, baseLyricArr.length);

      if (isFinish) return;
      // when end song but still one more lyric item
      if (isNearFinish) {
         console.log("end add lyric");
         end.current = +audioEle.duration.toFixed(1);
         addLyric();
      }

      pause();
   };

   const isEnableAddBtn = useMemo(() => {
      return isClickPlay && !!baseLyricArr.length && !isFinish;
   }, [isFinish, baseLyricArr, isClickPlay]);

   const isCanPlay = useMemo(() => !!baseLyricArr.length, [baseLyricArr]);

   useEffect(() => {
      if (baseLyric) {
         const filteredLyric = baseLyric.split(/\r?\n/).filter((lyric) => lyric);
         setBaseLyricArr(filteredLyric);
      }
      if (baseLyricArr.length && firstTimeRender.current) firstTimeRender.current = false;

      console.log("check firstTimeRender", firstTimeRender.current);
   }, [baseLyric]);

   useEffect(() => {
      const audioEle = audioRef.current;
      if (!audioEle) return;

      if (realTimeLyrics.length) {
         const latestTime = realTimeLyrics[realTimeLyrics.length - 1].end;

         if (audioEle) {
            audioEle.currentTime = latestTime;
            start.current = latestTime;
         }
      }

      audioEle.addEventListener("ended", handleSongEnd);
      return () => {
         audioEle.removeEventListener("ended", handleSongEnd);
      };
   }, []);

   const text = `${theme.type === "light" ? "text-[#333]" : "text-white"}`;

   const style = {
      section: `bg-${theme.alpha} py-[10px] px-[20px] rounded-[12px] w-full`,
      row: "flex no-scrollbar justify-between gap-[20px]",
      col: "flex-grow flex flex-col gap-[20px]",
      formGroup: "flex flex-col gap-[5px] flex-grow",
      label: "text-md font-[500]",
      button: `${theme.content_bg} rounded-full text-white text-[14px] px-[10px]`,
      disable: " opacity-60 pointer-events-none ",
      icon: "h-[20px] w-[20px]",
      lyricBox: "list-none h-full max-[549px]:w-[100%] pb-[20%]",
      listItem: `w-full cursor-pointer py-[2px] ${theme.content_hover_text}`,
   };

   const ctaComponent = (
      <div className={`flex flex-wrap gap-[10px] mb-[20px] ${text}`}>
         <button onClick={() => setOpenModal(true)} className={style.button}>
            {baseLyric ? "Change lyric" : "Add lyric"}
         </button>
         <button ref={refs.setReference} {...getReferenceProps()} className={style.button + "  inline-flex items-center hover:brightness-90 px-[20px] py-[5px] rounded-full text-white text-[14px]"}>
            <RocketLaunchIcon className="h-[20px] w-[20px] mr-[5px]" />
            Speed
         </button>
         {isPlaying ? (
            <Button variant={"primary"} onClick={pause} className={style.button + (!isClickPlay ? style.disable : "")}>
               Pause
            </Button>
         ) : (
            <Button variant={"primary"} onClick={play} className={style.button + (isPlaying || !isCanPlay ? style.disable : "")}>
               Play
            </Button>
         )}
         <Button variant={"primary"} onClick={addLyric} className={style.button + (!isEnableAddBtn && style.disable)}>
            Add
         </Button>
         <Button variant={"primary"} onClick={removeLyric} className={style.button + (!realTimeLyrics.length || !baseLyricArr.length ? style.disable : "")}>
            Remove
         </Button>
      </div>
   );

   return (
      <>
         {ctaComponent}

         <div className={`${style.row} ${style.section} mb-[0] h-[60vh] pb min-h-[200px] overflow-auto`}>
            <div className={style.lyricBox + "min-w-[50%] max-w-[50%] pr-[20px]"}>
               {!!baseLyricArr.length ? (
                  <>
                     {baseLyricArr.map((lyric, index) => (
                        <LyricItem firstTimeRender={firstTimeRender.current} className="pb-[34px]" key={index} inUpload active={index === currentLyricIndex} done={index != currentLyricIndex}>
                           {lyric}
                        </LyricItem>
                     ))}
                  </>
               ) : (
                  <h1>Base lyric...</h1>
               )}
            </div>

            <div className={style.lyricBox + " border-none w-[50%]"}>
               {!!realTimeLyrics?.length &&
                  realTimeLyrics.map((lyric, index) => (
                     <div key={index} className="pb-[10px]">
                        <span className="text-[16px] font-bold">{lyric.text}</span>
                        <div className="flex gap-[10px]">
                           <button className={` ${theme.content_hover_text}`} onClick={() => handleSetTime(lyric.start)}>
                              {lyric.start}s
                           </button>
                           <span> - </span>
                           <button className={` ${theme.content_hover_text}`} onClick={() => handleSetTime(lyric.end)}>
                              {lyric.end}s
                           </button>
                        </div>
                     </div>
                  ))}
            </div>
         </div>

         <Button isLoading={loading} className={`${theme.content_bg} text-[14px] rounded-full mt-[20px]`} variant={"primary"} onClick={() => handleSetLyricToDb()}>
            Save
         </Button>

         {openSpeedSetting && (
            <FloatingFocusManager context={context} modal={false}>
               <div className="z-[99]" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                  <PopupWrapper theme={theme}>
                     <ul className="w-[100px] text-center text-[14px]">
                        <li
                           onClick={() => handlePlaySpeed(1)}
                           className={`
                  ${playSpeed === 1 && theme.content_text} 
                  ${style.listItem}`}
                        >
                           1x
                        </li>
                        <li
                           onClick={() => handlePlaySpeed(1.2)}
                           className={`
                  ${playSpeed === 1.2 && theme.content_text}
                  ${style.listItem}`}
                        >
                           1.2x
                        </li>
                        <li
                           onClick={() => handlePlaySpeed(1.5)}
                           className={`
                  ${playSpeed === 1.5 && theme.content_text}
                  ${style.listItem}`}
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
               <div className={`w-[700px] max-w-[90vw]  rounded-[8px] p-[20px] ${theme.side_bar_bg} ${text}`}>
                  <textarea ref={textareaRef} value={baseLyric} onChange={(e) => setBaseLyric(e.target.value)} className="w-full rounded-[4px] mb-[10px] min-h-[50vh] bg-transparent border p-[10px]" />
                  <Button variant={"primary"} onClick={() => handleAddBaseLyric()} className={style.button}>
                     Save
                  </Button>
               </div>
            </Modal>
         )}
      </>
   );
}
