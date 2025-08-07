import { useMemo } from "react";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllPlayStatusStore } from "@/stores/redux/PlayStatusSlice";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { usePlayerContext } from "@/stores";
import { Image } from "@/components";
import usePlayerAction from "@/layout/primary-layout/_hooks/usePlayerAction";
import useHideMobileBottomPlayer from "./_hooks/useHideMobileBottomPlayer";
import MyMusicNavItem from "./_components/MyMusicNavItem";

export default function MobileBottomPlayer() {
  const { isOpenFullScreen, setIsOpenFullScreen, audioRef } =
    usePlayerContext();

  if (!audioRef.current) return <></>;

  // const { theme } = useThemeContext();
  const { playStatus } = useSelector(selectAllPlayStatusStore);
  const { currentSongData } = useSelector(selectSongQueue);

  const { handlePlayPause } = usePlayerAction();

  const { shouldHideAll, shouldHidePlayer, location } =
    useHideMobileBottomPlayer({
      audioEle: audioRef.current,
    });

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

  const getActiveClasses = (condition: boolean) => {
    if (condition) return `text-[--primary-cl]`;
    return "";
  };

  const classes = {
    wrapper: `block  bg-transparent md:hidden fixed bottom-0 w-full transition-transform overflow-hidden border-t border-[--a-5-cl] z-[9]`,
    container: `absolute inset-0 bg-[--player-cl] bg-opacity-[0.7] backdrop-blur-[15px] z-[-1]`,
    songImageWrapper: `flex flex-row items-center flex-grow h-full`,
    image: `w-[54px] h-[54px] flex-shrink-0`,
    cta: `ml-2 flex-shrink-0`,
  };

  return (
    <div
      className={`${classes.wrapper} ${shouldHideAll ? "translate-y-[100%]" : ""}`}
    >
      <div
        className={`${classes.container} ${
          isOpenFullScreen ? "opacity-0 transition-opacity delay-[.3s]" : ""
        }`}
      ></div>

      <div
        className={`flex justify-between items-center px-4 py-3 ${shouldHidePlayer ? "hidden" : ""}`}
      >
        <div
          onClick={() =>
            currentSongData?.song.name ? setIsOpenFullScreen(true) : {}
          }
          className={`mobile-current-song flex-grow`}
        >
          {/* song image, name and singer */}
          <div className={classes.songImageWrapper}>
            <div className={classes.image}>
              <Image
                src={currentSongData?.song.image_url}
                className="rounded-full"
              />
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
        <div
          className={`${classes.cta} ${!currentSongData?.song.name && "disable"}`}
        >
          <button className={`p-[4px]`} onClick={handlePlayPause}>
            {renderIcon}
          </button>
          {/*    <button onClick={() => controlRef.current?.handleNext()} className={`p-[4px]`}>
            <ForwardIcon className="w-10" />
          </button>*/}
        </div>
      </div>

      <div
        className={`flex items-center py-1 justify-evenly [&_div]:flex 
      [&_div]:flex-col 
      [&_div]:items-center
      [&_svg]:w-6
      [&_span]:text-[10px]
      ${!shouldHidePlayer ? "border-t border-[--a-5-cl]" : ""}
      `}
      >
        <Link
          className={`
              ${getActiveClasses(location.pathname === "/")}
            `}
          to={"/"}
        >
          <div>
            <HomeIcon />
            <span>For You</span>
          </div>
        </Link>

        <Link
          className={`
              ${getActiveClasses(location.pathname === "/discover")}
            `}
          to={"/discover"}
        >
          <div>
            <GlobeAsiaAustraliaIcon />
            <span>Discover</span>
          </div>
        </Link>

        <Link
          className={`
              ${getActiveClasses(location.pathname === "/search")}
            `}
          to={"/search"}
        >
          <div>
            <MagnifyingGlassIcon />
            <span>Search</span>
          </div>
        </Link>
        <MyMusicNavItem
          ActiveClass={getActiveClasses(location.pathname === "/my-music")}
        />
      </div>
    </div>
  );
}
