import { useDispatch, useSelector } from "react-redux";
import { Button, PopupWrapper, Switch } from "..";
import { useTheme } from "@/store";
import {
  selectAllPlayStatusStore,
  setPlayStatus,
  togglePlayControl,
} from "@/store/PlayStatusSlice";
import { setLocalStorage } from "@/utils/appHelpers";

export default function FullScreenPlayerSetting() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const {
 lyricSize, songBackground 
  } = useSelector(selectAllPlayStatusStore);

  const handleChangeLyricSize = (size: typeof lyricSize) => {
    dispatch(setPlayStatus({ lyricSize: size }));
    setLocalStorage("lyricSize", size);
  };

  const classes = {
    disableBtn: "bg-white/10 bg-opacity-20",
    lyricSizeBtn: `group/text justify-center !hover:brightness-100 font-[600] h-[30px] w-[30px] sm:h-[26px] sm:w-[26px] relative ${theme.content_hover_bg}`,
    itemContainer: `flex justify-between  px-3 py-2 items-center min-h-[30px] hover:bg-[#fff]/5`,
    text: "text-sm",
  };

  return (
    <>
      <div className="w-[240px] sm:w-[220px]">
        <PopupWrapper
          p={"clear"}
          className="space-y-[6px] text-white py-3"
          theme={theme}
        >
          <div className={`${classes.itemContainer}`}>
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
                <span className="leading-[1] text-[11px]">A</span>
              </Button>
              <Button
                onClick={() => handleChangeLyricSize("medium")}
                variant={"circle"}
                size={"clear"}
                className={`${
                  lyricSize === "medium" ? theme.content_bg : classes.disableBtn
                } ${classes.lyricSizeBtn}`}
              >
                <span className="leading-[1] text-[13px]">A</span>
              </Button>
              <Button
                onClick={() => handleChangeLyricSize("large")}
                variant={"circle"}
                size={"clear"}
                className={`${
                  lyricSize === "large" ? theme.content_bg : classes.disableBtn
                } ${classes.lyricSizeBtn}`}
              >
                <span className="leading-[1] text-[15px]">A</span>
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
          {/* {!isOnMobile && (
            <div className={`${classes.itemContainer}`}>
              <p className={classes.text}>Song image</p>
              <Switch
                size="thin"
                className="bg-white/10"
                active={songImage}
                cb={() => dispatch(togglePlayControl({ variant: "songImage" }))}
              />
            </div>
          )} */}
        </PopupWrapper>
      </div>
    </>
  );
}
