import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Button, Modal } from "./";
import { useTheme } from "../store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { selectAllPlayStatusStore, setPlayStatus } from "../store/PlayStatusSlice";
import { getLocalStorage, handleTimeText, setLocalStorage } from "../utils/appHelpers";

type Props = {
   cb: () => void;
   isPlaying: boolean;
   play: () => void;
   isOpenFullScreen: boolean;
};

function Countdown({ cb, isPlaying, play, isOpenFullScreen }: Props) {
   const dispatch = useDispatch();
   const { theme } = useTheme();

   const {
      playStatus: { isTimer },
   } = useSelector(selectAllPlayStatusStore);
   const [sec, setSec] = useState(() => getLocalStorage()["isTimer"] || 0);
   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);

   const [isOpenModal, setIsOpenModal] = useState(false);
   const timerId = useRef<NodeJS.Timeout>();

   const consuming = useRef(0);
   const lastTimer = useRef(0);
   const playAfterAddTimer = useRef(false);

   const handleContinuePlay = () => {
      lastTimer.current = 0;
      setIsOpenModal(false);
      play();
   };

   const closeModal = () => setIsOpenModal(false);

   const handleCloseModal = () => {
      closeModal();
      lastTimer.current = 0;
   };

   const clearTimer = () => {
      dispatch(setPlayStatus({ isTimer: 0 }));
      setSec(0);
      setLocalStorage("isTimer", 0);
   };

   useEffect(() => {
      if (!someThingToTrigger) return;

      if (sec === 1) {
         console.log("pause");

         cb();
         setSec(0);
         dispatch(setPlayStatus({ isTimer: 0 }));

         setLocalStorage("isTimer", 0);
         setIsOpenModal(true);

         return;
      }

      setSec(sec - 1);
   }, [someThingToTrigger]);

   useEffect(() => {
      if (!isTimer) return;

      // case after add timer but no play
      console.log("check sec", sec, lastTimer.current);

      if (!isPlaying && sec === lastTimer.current) {
         // for case when sec just ini
         // and not enough to run first countdown
         // when user press pause this time, song alway play
         playAfterAddTimer.current = true;
         play();

         // case user play song and pause
      } else if (!isPlaying) return;

      if (!sec) {
         setSec(isTimer);
         lastTimer.current = isTimer;
      }

      timerId.current = setInterval(() => {
         setSomeThingToTrigger(Math.random());
      }, 1000);

      return () => {
         clearInterval(timerId.current);
         setSomeThingToTrigger(0);
      };
   }, [isTimer, isPlaying]);

   useEffect(() => {
      return () => {
         playAfterAddTimer.current = false;
         // suddenly turn of
         // console.log("check sec", sec);
         if (sec) lastTimer.current = 0;
      };
   }, [isTimer]);

   useEffect(() => {
      if (!sec) return;
      consuming.current += 1;

      if (consuming.current === 5) {
         setLocalStorage("isTimer", sec);
         consuming.current = 0;
      }
   }, [sec]);

   return (
      <>
         {!!sec && !isOpenFullScreen && (
            <div className="absolute bottom-[100%] w-[70%] left-[50%] translate-x-[-50%]">
               <div
                  className={`${theme.content_bg} flex justify-center gap-[10px] py-[2px] text-[13px] px-[20px] rounded-tl-[4px] rounded-tr-[4px]`}
               >
                  <p className={` text-[13px]`}>Song stop in {handleTimeText(sec)}</p>
                  <button onClick={clearTimer}>
                     <XMarkIcon className="w-[18px]" />
                  </button>
               </div>
            </div>
         )}

         {isOpenModal && (
            <Modal closeModal={closeModal}>
               <div className="w-[500px] max-w-[calc(100vw-40px)]">
                  <h1 className="text-[22px]">
                     You have been listened music in {handleTimeText(lastTimer.current)}
                  </h1>

                  <div className="flex gap-[10px] mt-[30px]">
                     <Button
                        onClick={() => handleContinuePlay()}
                        size={"normal"}
                        className={`${theme.content_bg} rounded-[99px]`}
                     >
                        Continue playing
                     </Button>

                     <Button
                        onClick={handleCloseModal}
                        size={"normal"}
                        className={`bg-${theme.alpha} rounded-[99px]`}
                     >
                        Close
                     </Button>
                  </div>
               </div>
            </Modal>
         )}
      </>
   );
}

export default Countdown;
