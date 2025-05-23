import { useMemo } from "react";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { usePlayerContext, useThemeContext } from "@/stores";
import { Image } from "@/components";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";

export default function MobileBottomPlayer() {
  const { theme } = useThemeContext();
  const { isOpenFullScreen, setIsOpenFullScreen } = usePlayerContext();
  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);

  const {handlePlayPause} =usePlayerAction()

  const location = useLocation();
  const inEdit = useMemo(() => location.pathname.includes("lyric"), [location]);

  const renderIcon = useMemo(() => {
    switch (playStatus) {
      case "playing":
        return <PauseCircleIcon className="w-10" />;
      case "error":
        return <ExclamationCircleIcon className="w-10" />;
      case "loading":
      case "waiting":
        return <ArrowPathIcon className="w-10 animate-spin" />;
      case "paused":
        return <PlayCircleIcon className="w-10" />;
    }
  }, [playStatus]);

  const classes = {
    wrapper: `block md:hidden fixed bottom-0 transition-transform w-full h-[80px] overflow-hidden border-t border-${theme.alpha} z-40  px-4`,
    container: `absolute inset-0 ${theme.bottom_player_bg} bg-opacity-[0.7] backdrop-blur-[15px] z-[-1]`,
    songImageWrapper: `flex flex-row items-center flex-grow h-full`,
    image: `w-[54px] h-[54px] flex-shrink-0`,
    cta: `ml-2 flex-shrink-0`,
  };

  return (
    <div className={`${classes.wrapper} ${inEdit ? "translate-y-[100%]" : ""}`}>
      <div
        className={`${classes.container} ${
          isOpenFullScreen ? "opacity-0 transition-opacity delay-[.3s]" : ""
        }`}
      ></div>

      <div className={`flex justify-between items-center h-full`}>
        <div
          onClick={() => (currentSongData?.song.name ? setIsOpenFullScreen(true) : {})}
          className={`mobile-current-song flex-grow`}
        >
          {/* song image, name and singer */}
          <div className={classes.songImageWrapper}>
            <div className={classes.image}>
              <Image src={currentSongData?.song.image_url} className="rounded-full" />
            </div>

            <div className="flex-grow ml-2">
              {currentSongData?.song.song_url && (
                <>
                  <p className="font-playwriteCU line-clamp-1">
                    {currentSongData?.song.name || "..."}
                  </p>
                  <p className={`opacity-70 text-sm line-clamp-1`}>
                    {currentSongData?.song.singers.map(
                      (s, i) => (i ? ", " : "") + s.name,
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* cta */}
        <div className={`${classes.cta} ${!currentSongData?.song.name && "disable"}`}>
          <button
            className={`p-[4px]`}
            onClick={handlePlayPause}
          >
            {renderIcon}
          </button>
          {/*    <button onClick={() => controlRef.current?.handleNext()} className={`p-[4px]`}>
            <ForwardIcon className="w-10" />
          </button>*/}
        </div>
      </div>
    </div>
  );
}
