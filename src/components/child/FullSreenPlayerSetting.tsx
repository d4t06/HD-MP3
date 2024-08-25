import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, PopupWrapper, Switch, TimerModal } from "..";
import { useTheme } from "../../store";
import {
   selectAllPlayStatusStore,
   setPlayStatus,
   togglePlayControl,
} from "../../store/PlayStatusSlice";
import { useState } from "react";
import { setLocalStorage } from "../../utils/appHelpers";

type Modal = "timer";

export default function FullScreenPlayerSetting() {
   const { theme, isOnMobile } = useTheme();
   const dispatch = useDispatch();

   const {
      playStatus: { isTimer, lyricSize, songBackground, songImage },
   } = useSelector(selectAllPlayStatusStore);

   const [isOpenModal, setIsOpenModal] = useState<Modal | "">();

   const closeModal = () => {
      setIsOpenModal("");
   };

   const handleChangeLyricSize = (size: typeof lyricSize) => {
      dispatch(setPlayStatus({ lyricSize: size }));
      setLocalStorage("lyricSize", size);
   };

   const handleTimerBtn = () => {
      if (isTimer) return dispatch(setPlayStatus({ isTimer: 0 }));
      setIsOpenModal("");
   };

   const classes = {
      disableBtn: "bg-white/10 bg-opacity-20",
      lyricSizeBtn: `group/text !hover:brightness-100 font-[600] h-[30px] w-[30px] sm:h-[26px] sm:w-[26px] relative ${theme.content_hover_bg}`,
      itemContainer: "flex justify-between items-center min-h-[30px]",
      text: "text-md text-[#ccc]",
   };

   return (
      <>
         <div className="w-[240px] sm:w-[220px]">
            <PopupWrapper
               variant={"default"}
               color="black"
               className="space-y-[6px] text-white"
               theme={theme}
            >
               <div className={classes.itemContainer}>
                  <p className={classes.text}>Lyric size</p>
                  <div className="flex space-x-[8px]">
                     <Button
                        onClick={() => handleChangeLyricSize("small")}
                        variant={"circle"}
                        size={"clear"}
                        className={`${
                           lyricSize === "small" ? theme.content_bg : classes.disableBtn
                        } ${classes.lyricSizeBtn}`}
                     >
                        <h1 className="leading-[1] text-[11px]">A</h1>
                     </Button>
                     <Button
                        onClick={() => handleChangeLyricSize("medium")}
                        variant={"circle"}
                        size={"clear"}
                        className={`${
                           lyricSize === "medium" ? theme.content_bg : classes.disableBtn
                        } ${classes.lyricSizeBtn}`}
                     >
                        <h1 className="leading-[1] text-[13px]">A</h1>
                     </Button>
                     <Button
                        onClick={() => handleChangeLyricSize("large")}
                        variant={"circle"}
                        size={"clear"}
                        className={`${
                           lyricSize === "large" ? theme.content_bg : classes.disableBtn
                        } ${classes.lyricSizeBtn}`}
                     >
                        <h1 className="leading-[1] text-[15px]">A</h1>
                     </Button>
                  </div>
               </div>
               <div className={`${classes.itemContainer}`}>
                  <p className={classes.text}>Song background</p>
                  <Switch
                     size="thin"
                     className="bg-white/10"
                     active={songBackground}
                     cb={() => dispatch(togglePlayControl({ variant: "songBackground" }))}
                  />
               </div>
               {!isOnMobile && (
                  <div className={`${classes.itemContainer}`}>
                     <p className={classes.text}>Song image</p>
                     <Switch
                        size="thin"
                        className="bg-white/10"
                        active={songImage}
                        cb={() => dispatch(togglePlayControl({ variant: "songImage" }))}
                     />
                  </div>
               )}

               <div className={`${classes.itemContainer}`}>
                  <p className={classes.text}>Sleep timer</p>
                  <Switch
                     className="bg-white/10"
                     size="thin"
                     active={!!isTimer}
                     cb={handleTimerBtn}
                  />
               </div>
            </PopupWrapper>
         </div>

         {isOpenModal && (
            <Modal classNames="z-[999]" closeModal={closeModal}>
               <TimerModal close={closeModal} />
            </Modal>
         )}
      </>
   );
}
