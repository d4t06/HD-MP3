import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lyric, RealTimeLyric, Song, ThemeType } from "../types";

import {
   ChevronDoubleLeftIcon,
   ChevronDoubleRightIcon,
   ChevronLeftIcon,
   MinusIcon,
   PlusIcon,
   QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import { Modal, LyricItem, Button, PopupWrapper, AddLyricItem, ConfirmModal } from "../components";

import { myDeleteDoc, mySetDoc } from "../utils/firebaseHelpers";
import { setSong, useActuallySongs, useSongsStore, useToast } from "../store";
import { updateSongsListValue } from "../utils/appHelpers";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import tutorial1 from "../assets/tutorial/tutorial1.png";
import tutorial2 from "../assets/tutorial/tutorial2.png";
import ModalHeader from "./modals/ModalHeader";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

type Props = {
   theme: ThemeType & { alpha: string };
   audioRef: RefObject<HTMLAudioElement>;
   lyric: Lyric;
   song: Song;
   admin?: boolean;
};

export default function LyricEditor({
   audioRef,
   theme,
   song,
   admin,

   lyric,
}: Props) {
   const dispatch = useDispatch();
   const { userSongs, setUserSongs, adminSongs, setAdminSongs } = useSongsStore();
   const { setSuccessToast, setErrorToast } = useToast();
   const { actuallySongs, setActuallySongs } = useActuallySongs();

   const [isPlaying, setIsPlaying] = useState(false);
   const [isClickPlay, setIsClickPlay] = useState(false);

   const [baseLyric, setBaseLyric] = useState<string>(lyric ? lyric.base : "");
   const [baseLyricArr, setBaseLyricArr] = useState<string[]>([]);
   const [realTimeLyrics, setRealTimeLyrics] = useState<RealTimeLyric[]>(lyric ? lyric.real_time : []);

   const [openSpeedSetting, setOpenSpeedSetting] = useState(false);
   const [playSpeed, setPlaySpeed] = useState(1);
   const [loading, setLoading] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(realTimeLyrics ? realTimeLyrics.length : 0);
   const [textAreaValue, setTextAreaValue] = useState(baseLyric || "");
   const [isChange, setIsChange] = useState(false);

   const firstTimeRender = useRef(true);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const end = useRef(0);
   const start = useRef(0);
   const scrollBehavior = useRef<ScrollBehavior>("smooth");

   const modalComponent = useRef<"add_base_lyric" | "delete_lyric" | "turtorial" | "confirm_navigate_back">(
      "add_base_lyric"
   );

   const navigate = useNavigate();

   const isFinish = useMemo(() => {
      return realTimeLyrics.length >= baseLyricArr.length;
   }, [baseLyricArr, realTimeLyrics, isClickPlay]);

   const isNearFinish = useMemo(() => {
      return realTimeLyrics.length === baseLyricArr.length - 1;
   }, [baseLyricArr, realTimeLyrics, isClickPlay]);

   const isEnableAddBtn = useMemo(() => {
      return isClickPlay && !!baseLyricArr.length && !isFinish;
   }, [isFinish, baseLyricArr, isClickPlay]);

   const targetSongs = useMemo(() => (admin ? adminSongs : userSongs), [adminSongs, userSongs]);

   const isCanPlay = useMemo(() => !!baseLyricArr.length, [baseLyricArr]);

   const handleError = () => {
      if (admin) navigate("/dashboard");
      else navigate("/");
   };

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
         setPlaySpeed(speed);
      }

      setOpenSpeedSetting(false);
   };

   const handleAddBaseLyric = () => {
      setBaseLyric(textAreaValue);
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

      if (isNearFinish) end.current = +audioEle.duration.toFixed(1);
      else end.current = +audioEle.currentTime.toFixed(1);

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

   const updateSongStore = (song: Song) => {
      const newSongs = [...targetSongs];

      const index = updateSongsListValue(song, newSongs);
      if (index == undefined) {
         setErrorToast({ message: "No song found" });
         setLoading(false);
         return;
      }

      // local
      if (admin) setAdminSongs(newSongs);
      else setUserSongs(newSongs);

      const newSongQueue = [...actuallySongs];
      updateSongsListValue(song, newSongQueue);
      setActuallySongs(newSongQueue);
      console.log("setActuallySongs");

      return index;
   };

   const handleSetLyricToDb = async () => {
      try {
         setLoading(true);
         pause();

         await mySetDoc({
            collection: "lyrics",
            data: { real_time: realTimeLyrics, base: baseLyric },
            id: song.id,
         });

         const newSong: Song = { ...song, lyric_id: song.id };
         const index = updateSongStore(newSong);
         if (!index) return;
         // api
         await mySetDoc({
            collection: "songs",
            data: { lyric_id: song.id },
            id: song.id,
         });

         // finish
         dispatch(setSong({ ...newSong, currentIndex: index, song_in: "user" }));
         setSuccessToast({ message: "Add lyric successful" });
         setIsChange(false);
      } catch (error) {
         console.log({ message: error });
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteLyric = async () => {
      try {
         setLoading(true);
         await mySetDoc({
            collection: "songs",
            data: { lyric_id: "" } as Partial<Song>,
            id: song.id,
         });
         await myDeleteDoc({ collection: "lyrics", id: song.lyric_id });
         setSuccessToast({ message: "Delete lyric successful" });

         const newSong: Song = { ...song, lyric_id: "" };
         const index = updateSongStore(newSong);
         if (!index) return;

         dispatch(setSong({ ...newSong, currentIndex: index, song_in: "user" }));

         navigateBack();
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   const handleSongEnd = () => {
      pause();
      addLyric();
   };

   const handleOpenModal = (name: typeof modalComponent.current) => {
      setOpenModal(true);
      modalComponent.current = name;

      if (name === "add_base_lyric") {
      }
   };

   const seekSong = (direction: "next" | "prev") => {
      const audioEle = audioRef.current as HTMLAudioElement;
      if (direction === "next") audioEle.currentTime += 2;
      else audioEle.currentTime -= 2;
   };

   const handleNavigateBack = () => {
      if (isChange) {
         handleOpenModal("confirm_navigate_back");
      } else navigateBack();
   };

   const navigateBack = () => navigate(admin ? "/dashboard" : "/mysongs");

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

      if (!targetSongs.length || !targetSongs.find((s) => s.id === song.id)) {
         handleError();
         return;
      }

      audioEle.addEventListener("ended", handleSongEnd);
      return () => {
         audioEle.removeEventListener("ended", handleSongEnd);
      };
   }, []);

   useEffect(() => {
      if (isChange) return;
      if (!lyric) {
         setIsChange(true);
         return;
      }

      if (lyric.real_time !== realTimeLyrics || lyric.base != baseLyric) setIsChange(true);
   }, [baseLyric, realTimeLyrics]);

   useEffect(() => {
      if (!isChange) return;

      const handleWindowRedload = (e: BeforeUnloadEvent) => {
         e.preventDefault();
      };

      window.addEventListener("beforeunload", handleWindowRedload);

      return () => {
         window.removeEventListener("beforeunload", handleWindowRedload);
      };
   }, [isChange]);

   const text = `${theme.type === "light" ? "text-[#333]" : "text-white"}`;

   const classes = {
      section: `bg-${theme.alpha} py-[10px] px-[20px] rounded-[12px] w-full`,
      row: "flex no-scrollbar justify-between -mx-[10px]",
      col: "flex-grow flex flex-col gap-[10px]",
      formGroup: "flex flex-col gap-[5px] flex-grow",
      label: "text-md font-[500]",
      button: `${theme.content_bg} rounded-full text-white text-[14px] px-[10px]`,
      disable: " opacity-60 pointer-events-none ",
      icon: "h-[20px] w-[20px]",
      lyricBox: "list-none h-full px-[10px] max-[549px]:w-[100%] pb-[20%] ",
      listItem: `h-[34px] w-[34px] text-[14px]`,
      changeSpeedBtn:
         "inline-flex items-center hover:brightness-90 px-[20px] py-[5px] rounded-full text-white text-[14px]",
      ctaContainer: "flex justify-between gap-[10px] mb-[20px]",
      getActiveClass: (val: boolean) => (val ? theme.content_bg : `bg-${theme.alpha}`),
   };

   const ctaComponent = (
      <div className={`${classes.ctaContainer} ${text}`}>
         <div className="left flex flex-wrap gap-[10px]">
            <button onClick={() => handleOpenModal("add_base_lyric")} className={classes.button}>
               {baseLyric ? "Change lyric" : "Add lyric"}
            </button>

            <Popover isOpenFromParent={openSpeedSetting} setIsOpenFromParent={setOpenSpeedSetting}>
               <PopoverTrigger className={`${classes.button} ${classes.changeSpeedBtn}`}>{playSpeed}x</PopoverTrigger>
               <PopoverContent>
                  <PopupWrapper theme={theme}>
                     <div className="flex justify-center gap-[8px]">
                        <Button
                           variant="circle"
                           onClick={() => handlePlaySpeed(1)}
                           className={`${classes.getActiveClass(playSpeed === 1)} ${classes.listItem}`}
                        >
                           1x
                        </Button>
                        <Button
                           variant="circle"
                           onClick={() => handlePlaySpeed(1.2)}
                           className={`${classes.getActiveClass(playSpeed === 1.2)} ${classes.listItem}`}
                        >
                           1.2x
                        </Button>
                        <Button
                           variant="circle"
                           onClick={() => handlePlaySpeed(1.5)}
                           className={`${classes.getActiveClass(playSpeed === 1.5)} ${classes.listItem}`}
                        >
                           1.5x
                        </Button>
                     </div>
                  </PopupWrapper>
               </PopoverContent>
            </Popover>

            {isPlaying ? (
               <Button
                  variant={"primary"}
                  onClick={pause}
                  className={classes.button + (!isClickPlay ? classes.disable : "")}
               >
                  Pause
               </Button>
            ) : (
               <Button
                  variant={"primary"}
                  onClick={play}
                  className={classes.button + (isPlaying || !isCanPlay ? classes.disable : "")}
               >
                  Play
               </Button>
            )}
            <Button
               variant={"primary"}
               onClick={addLyric}
               className={classes.button + (!isEnableAddBtn && classes.disable)}
            >
               <PlusIcon className="w-[16px]" />
            </Button>
            <Button
               variant={"primary"}
               onClick={removeLyric}
               className={classes.button + (!realTimeLyrics.length || !baseLyricArr.length ? classes.disable : "")}
            >
               <MinusIcon className="w-[16px]" />
            </Button>
            <Button
               variant={"primary"}
               onClick={() => seekSong("prev")}
               className={classes.button + (!isClickPlay || !baseLyricArr.length ? classes.disable : "")}
            >
               <ChevronDoubleLeftIcon className="w-[16px] mr-[5px]" />
               2s
            </Button>
            <Button
               variant={"primary"}
               onClick={() => seekSong("next")}
               className={classes.button + (!isClickPlay || !baseLyricArr.length ? classes.disable : "")}
            >
               2s
               <ChevronDoubleRightIcon className="w-[16px] ml-[5px]" />
            </Button>
         </div>

         <button onClick={() => handleOpenModal("turtorial")}>
            <QuestionMarkCircleIcon className="w-[20px]" />
         </button>
      </div>
   );

   return (
      <div className={`${loading ? "opacity-[0.6] pointer-events-none" : ""}`}>
         <button
            onClick={handleNavigateBack}
            className={`inline-flex text-[20px] font-bold mb-[14px] ${theme.content_hover_text}`}
         >
            <ChevronLeftIcon className="w-[25px]" />
            <span className="ml-[12px]">{song.name}</span>
         </button>
         {ctaComponent}

         <div className={`${classes.row} ${classes.section} mb-[0] h-[55vh] pb min-h-[200px] overflow-auto`}>
            <div className={classes.lyricBox + "min-w-[50%] max-w-[50%]"}>
               {!!baseLyricArr.length ? (
                  <>
                     {baseLyricArr.map((lyric, index) => (
                        <LyricItem
                           inUpload
                           scrollBehavior={scrollBehavior}
                           className="pb-[30px] leading-[1.2] mr-[24px]"
                           key={index}
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
            </div>

            <div className={classes.lyricBox + " border-none w-[50%]"}>
               {!!realTimeLyrics?.length &&
                  realTimeLyrics.map((lyric, index) => (
                     <AddLyricItem
                        handleSetTime={handleSetTime}
                        lyric={lyric}
                        theme={theme}
                        key={index}
                        index={index}
                        realTimeLyrics={realTimeLyrics}
                        setRealTimeLyrics={setRealTimeLyrics}
                     />
                  ))}
            </div>
         </div>

         <Button
            // isLoading={loading}
            className={`${theme.content_bg} ${
               isChange ? "" : "opacity-[.6] pointer-events-none"
            } text-[14px] rounded-full mt-[20px]`}
            variant={"primary"}
            onClick={handleSetLyricToDb}
         >
            Save
         </Button>

         <Button
            // isLoading={loading}
            className={`bg-red-500 text-[#fff] text-[14px] ml-[12px] rounded-full mt-[20px]`}
            variant={"primary"}
            onClick={() => handleOpenModal("delete_lyric")}
         >
            Delete
         </Button>

         {openModal && (
            <Modal classNames="w-[700px] max-w-[calc(90vw-40px)]" theme={theme} setOpenModal={setOpenModal}>
               {modalComponent.current == "add_base_lyric" && (
                  <>
                     <textarea
                        ref={textareaRef}
                        value={textAreaValue}
                        onChange={(e) => setTextAreaValue(e.target.value)}
                        className="w-full rounded-[4px] mb-[10px] min-h-[50vh] bg-transparent border p-[10px]"
                     />
                     <Button variant={"primary"} onClick={handleAddBaseLyric} className={classes.button}>
                        Ok
                     </Button>
                  </>
               )}

               {modalComponent.current === "delete_lyric" && (
                  <ConfirmModal
                     loading={loading}
                     label={"Delete playlist ?"}
                     theme={theme}
                     callback={handleDeleteLyric}
                     setOpenModal={setOpenModal}
                  />
               )}

               {modalComponent.current === "confirm_navigate_back" && (
                  <ConfirmModal
                     loading={loading}
                     label={"Your change not save"}
                     theme={theme}
                     buttonLabel="Close and don't save"
                     callback={navigateBack}
                     setOpenModal={setOpenModal}
                  />
               )}

               {modalComponent.current === "turtorial" && (
                  <>
                     <ModalHeader title="Tutorial" setIsOpenModal={setOpenModal} />
                     <div className="h-[500px] max-h-[75vh] overflow-y-auto no-scrollbar">
                        <h1 className="font-semibold mb-[12px]">Phím chắc năng:</h1>
                        <img className="w-full border rounded-[16px]" src={tutorial2} alt="" />
                        <br />

                        <h1 className="font-semibold mb-[12px]">Cách thêm lời bài hát:</h1>
                        <img className="w-full border rounded-[16px]" src={tutorial1} alt="" />
                     </div>
                  </>
               )}
            </Modal>
         )}
      </div>
   );
}
