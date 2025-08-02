import { usePlayerContext } from "@/stores";
import { setLocalStorage } from "@/utils/appHelpers";
import { PopupWrapper, Switch } from ".";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import VertialMenu from "./popup/VerticalMenu";

export default function FullScreenPlayerSetting() {
  // const { theme } = useThemeContext();

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

  const getActiveSize = (size: typeof lyricSize) => {
    if (size === lyricSize) return "bg-[--primary-cl]";
    return "bg-[--a-5-cl]";
  };

  const classes = {
    disableBtn: "bg-white/10 bg-opacity-20",
    lyricSizeBtn: `justify-center rounded-full hover:bg-[--a-10-cl]  font-[600] h-[30px] w-[30px] sm:h-[26px] sm:w-[26px] relative`,
    itemContainer: `justify-between min-h-[30px]`,
    text: "text-sm",
  };

  return (
    <>
      <PopupWrapper
        colorClasses="bg-[#333] text-white"
        className="w-[240px] sm:w-[290px]"
      >
        <VertialMenu dismiss={false}>
          <div className={`${classes.itemContainer}`}>
            <p className={classes.text}>Lyric size</p>
            <div className="flex space-x-[8px]">
              <button
                onClick={() => handleChangeLyricSize("small")}
                className={`${getActiveSize("small")} ${classes.lyricSizeBtn}`}
              >
                <span className="leading-[1] text-[11px]">A</span>
              </button>
              <button
                onClick={() => handleChangeLyricSize("medium")}
                className={`${getActiveSize("medium")} ${classes.lyricSizeBtn}`}
              >
                <span className="leading-[1] text-[13px]">A</span>
              </button>
              <button
                onClick={() => handleChangeLyricSize("large")}
                className={`${getActiveSize("large")} ${classes.lyricSizeBtn}`}
              >
                <span className="leading-[1] text-[15px]">A</span>
              </button>
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
        </VertialMenu>
      </PopupWrapper>
    </>
  );
}
