import { usePlayerContext, useThemeContext } from "@/stores";
import { setLocalStorage } from "@/utils/appHelpers";
import { Button, PopupWrapper, Switch } from ".";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";

export default function FullScreenPlayerSetting() {
  const { theme } = useThemeContext();

  const {
    playerConig: { isCrossFade, isEnableBeat, lyricSize, songBackground },
    updatePlayerConfig,
    audioRef,
    shouldSyncSongDuration,
  } = usePlayerContext();
  const { currentSongData } = useSelector(selectSongQueue);

  const handleChangeLyricSize = (size: typeof lyricSize) => {
    updatePlayerConfig({ lyricSize: size });
    setLocalStorage("lyricSize", size);
  };

  const handleToggleBeat = () => {
    if (!audioRef.current || !currentSongData?.song) return;

    const newValue = !isEnableBeat;

    const currentTime = audioRef.current.currentTime;

    setLocalStorage("current_time", currentTime);

    shouldSyncSongDuration.current = true;

    audioRef.current.src = newValue
      ? currentSongData.song.beat_url
      : currentSongData.song.song_url;

    // audioRef.current.currentTime = currentTime // fix scroll top lyric list


    updatePlayerConfig({ isEnableBeat: newValue });
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
        <PopupWrapper p={"clear"} className="text-white py-3" theme={theme}>
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
              active={songBackground}
              cb={() => updatePlayerConfig({ songBackground: !songBackground })}
            />
          </div>

          {currentSongData?.song.beat_url && (
            <div className={`${classes.itemContainer}`}>
              <p className={classes.text}>Song beat</p>
              <Switch size="thin" active={isEnableBeat} cb={handleToggleBeat} />
            </div>
          )}
          <div className={`${classes.itemContainer}`}>
            <p className={classes.text}>Cross fade</p>
            <Switch
              size="thin"
              active={isCrossFade}
              cb={() => updatePlayerConfig({ isCrossFade: !isCrossFade })}
            />
          </div>
        </PopupWrapper>
      </div>
    </>
  );
}
