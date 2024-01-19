import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, PopupWrapper, Switch, TimerModal } from "..";
import { useTheme } from "../../store";
import { selectAllPlayStatusStore, setPlayStatus } from "../../store/PlayStatusSlice";
import { useState } from "react";

// type Props = {
   // handleChangeLyricSize: (size: "small" | "medium" | "large") => void;
   // lyricSize: "small" | "medium" | "large";
// };

export default function FullScreenPlayerSetting() {
   const { theme } = useTheme();
   const dispatch = useDispatch();

   const {
      playStatus: { isTimer, lyricSize },
   } = useSelector(selectAllPlayStatusStore);

   const [isOpenModal, setIsOpenModal] = useState(false);

   const handleChangeLyricSize = (size: typeof lyricSize) => {
      dispatch(setPlayStatus({ lyricSize: size }));
      localStorage.setItem("lyricSize", size);
   };

   const handleTimerBtn = () => {
      if (isTimer) return dispatch(setPlayStatus({ isTimer: 0 }));

      setIsOpenModal(true);
   };

   const classes = {
      disableBtn: "bg-gray-500 bg-opacity-20",
      lyricSizeBtn: `group/text !hover:brightness-100 h-[26px] w-[26px] relative ${theme.content_hover_bg}`,
      itemContainer: "flex justify-between items-center",
   };

   return (
      <>
         <div className="w-[220px]">
            <PopupWrapper variant={"default"} className="bg-[#292929]" theme={theme}>
               <div className={classes.itemContainer}>
                  <p className="text-[14px] text-[#ccc]">Lyric size</p>
                  <div className="flex gap-[12px]">
                     <Button
                        onClick={() => handleChangeLyricSize("small")}
                        variant={"circle"}
                        className={`${lyricSize === "small" ? theme.content_bg : classes.disableBtn} ${
                           classes.lyricSizeBtn
                        }`}
                     >
                        <h1 className="leading-[1] text-[12px]">A</h1>
                     </Button>
                     <Button
                        onClick={() => handleChangeLyricSize("medium")}
                        variant={"circle"}
                        className={`${lyricSize === "medium" ? theme.content_bg : classes.disableBtn} ${
                           classes.lyricSizeBtn
                        }`}
                     >
                        <h1 className="leading-[1] text-[13px]">A</h1>
                     </Button>
                     <Button
                        onClick={() => handleChangeLyricSize("large")}
                        variant={"circle"}
                        className={`${lyricSize === "large" ? theme.content_bg : classes.disableBtn} ${
                           classes.lyricSizeBtn
                        }`}
                     >
                        <h1 className="leading-[1] text-[14px]">A</h1>
                     </Button>
                  </div>
               </div>
               <div className={`${classes.itemContainer} mt-[10px]`}>
                  <p className="text-[14px] text-[#ccc]">Another option</p>
                  <Switch size="thin" active={false} cb={() => {}} />
               </div>

               <div className={`${classes.itemContainer} mt-[10px]`}>
                  <p className="text-[14px] text-[#ccc]">Sleep timer</p>
                  <Switch size="thin" active={!!isTimer} cb={handleTimerBtn} />
               </div>
            </PopupWrapper>
         </div>

         {isOpenModal && (
            <Modal classNames="z-[999]" setOpenModal={setIsOpenModal} theme={theme}>
               <TimerModal setIsOpenModal={setIsOpenModal} theme={theme} />
            </Modal>
         )}
      </>
   );
}
