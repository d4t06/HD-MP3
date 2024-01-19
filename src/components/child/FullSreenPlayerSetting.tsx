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

  const [active, setActive] = useState(false);

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
    lyricSizeBtn: `group/text !hover:brightness-100 h-[30px] w-[30px] sm:h-[26px] sm:w-[26px] relative ${theme.content_hover_bg}`,
    itemContainer: "flex justify-between items-center min-h-[30px]",
    text: "text-[16px] sm:text-[14px] text-[#ccc]",
  };

  return (
    <>
      <div className="w-[240px] sm:w-[220px]">
        <PopupWrapper
          variant={"default"}
          color='black'
          className="space-y-[10px]"
          theme={theme}
        >
          <div className={classes.itemContainer}>
            <p className={classes.text}>Lyric size</p>
            <div className="flex space-x-[8px]">
              <Button
                onClick={() => handleChangeLyricSize("small")}
                variant={"circle"}
                className={`${
                  lyricSize === "small" ? theme.content_bg : classes.disableBtn
                } ${classes.lyricSizeBtn}`}
              >
                <h1 className="leading-[1] text-[11px]">A</h1>
              </Button>
              <Button
                onClick={() => handleChangeLyricSize("medium")}
                variant={"circle"}
                className={`${
                  lyricSize === "medium" ? theme.content_bg : classes.disableBtn
                } ${classes.lyricSizeBtn}`}
              >
                <h1 className="leading-[1] text-[13px]">A</h1>
              </Button>
              <Button
                onClick={() => handleChangeLyricSize("large")}
                variant={"circle"}
                className={`${
                  lyricSize === "large" ? theme.content_bg : classes.disableBtn
                } ${classes.lyricSizeBtn}`}
              >
                <h1 className="leading-[1] text-[15px]">A</h1>
              </Button>
            </div>
          </div>
          <div className={`${classes.itemContainer}`}>
            <p className={classes.text}>Another option</p>
            <Switch size="thin" active={active} cb={() => setActive(!active)} />
          </div>

          <div className={`${classes.itemContainer}`}>
            <p className={classes.text}>Sleep timer</p>
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
