import { Dispatch, FC, SetStateAction, useMemo } from "react";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import siteLogo from "@/assets/siteLogo.png";
import { useTheme } from "@/store/ThemeContext";
import { useLocation } from "react-router-dom";
import { Image } from "..";
import useAudioControl from "@/hooks/useAudioControl";
import usePlayerControl from "@/hooks/usePlayerControl";

interface Props {
  audioEle: HTMLAudioElement;
  isOpenFullScreen: boolean;
  setIsOpenFullScreen: Dispatch<SetStateAction<boolean>>;
}

const MobileBottomPlayer: FC<Props> = ({
  audioEle,
  setIsOpenFullScreen,
  isOpenFullScreen,
}) => {
  const { theme } = useTheme();

  const { handleNext, currentSong, playStatus } = usePlayerControl();
  const { handlePlayPause } = useAudioControl({ audioEle });

  const location = useLocation();
  const inEdit = useMemo(() => location.pathname.includes("edit"), [location]);

  const renderIcon = useMemo(() => {
    switch (playStatus) {
      case "playing":
        return <PauseCircleIcon className="w-10" />;
      case "error":
        return <ExclamationCircleIcon className="w-10" />;
      case "loading":
        return <ArrowPathIcon className="w-10 animate-spin" />;
      case "paused":
        return <PlayCircleIcon className="w-10" />;
    }
  }, [playStatus]);

  const classes = {
    wrapper: `fixed bottom-0 transition-transform w-full h-[80px] border-t border-${theme.alpha} z-40  px-4`,
    container: `absolute inset-0 ${theme.bottom_player_bg} bg-opacity-[0.7] backdrop-blur-[15px] z-[-1]`,
    songImageWrapper: `flex flex-row items-center flex-grow h-full`,
    image: `w-[54px] h-[54px] flex-shrink-0`,
    cta: `pl-2 flex-shrink-0`,
  };

  return (
    <div className={`${classes.wrapper} ${inEdit ? "translate-y-full" : ""}`}>
      <div
        className={`${classes.container} ${
          isOpenFullScreen ? "opacity-0 transition-opacity delay-[.3s]" : ""
        }`}
      ></div>

      <div className={`flex items-center  h-full`}>
        <div
          onClick={() => (currentSong?.name ? setIsOpenFullScreen(true) : {})}
          className={`mobile-current-song flex-grow`}
        >
          {/* song image, name and singer */}
          <div className={classes.songImageWrapper}>
            <div className={classes.image}>
              <Image src={currentSong?.image_url || siteLogo} classNames="rounded-full" />
            </div>

            <div className="flex-grow  ml-[10px]">
              {currentSong?.song_url && (
                <>
                  <div className="h-[30px] relative overflow-hidden">
                    <div className="absolute left-0 whitespace-nowrap font-playwriteCU leading-[1.5]">
                      {currentSong?.name || "name"}
                    </div>
                  </div>
                  <p className={`opacity-70 line-clamp-1`}>
                    {currentSong?.singer || "singer"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* cta */}
        <div className={`${classes.cta} ${!currentSong?.name && "disable"}`}>
          <button className={`p-[4px]`} onClick={() => handlePlayPause()}>
            {renderIcon}
          </button>
          <button onClick={handleNext} className={`p-[4px]`}>
            <ForwardIcon className="w-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomPlayer;
