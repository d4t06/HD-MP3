import PlayerContextProvider, { usePlayerContext } from "@/store/PlayerContext";
import { forwardRef, Ref, useEffect, useImperativeHandle, useMemo } from "react";
import Image from "@/components/ui/Image";
import {
  ExclamationCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/store";
import useAudioControl from "@/hooks/useAudioControl";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/store/songQueueSlice";
import { ControlRef } from "@/components/Control";

type Props = { audioEle: HTMLAudioElement };

const PlayerControl = forwardRef(function ({ audioEle }: Props, ref: Ref<ControlRef>) {
  const { theme } = useTheme();
  const { currentSongData } = useSelector(selectSongQueue);

  const { status, handlePlayPause, pause } = useAudioControl({ audioEle });
  const inEdit = location.hash.includes("edit");

  useImperativeHandle(ref, () => ({
    handlePlayPause,
    handleNext: () => {},
    resetForNewSong: () => {},
    pause,
  }));

  const renderIcon = useMemo(() => {
    switch (status) {
      case "playing":
        return <PauseCircleIcon className="w-10" />;
      case "error":
        return <ExclamationCircleIcon className="w-10" />;
      case "paused":
        return <PlayCircleIcon className="w-10" />;
    }
  }, [status]);

  const classes = {
    wrapper: `fixed bottom-0 transition-transform w-full h-[70px] border-t border-${theme.alpha} z-40  px-4`,
    blurBg: `absolute inset-0 ${theme.bottom_player_bg} bg-opacity-[0.7] backdrop-blur-[15px] z-[-1]`,
  };

  return (
    <>
      <div className={`${classes.wrapper} ${inEdit ? "translate-y-full" : ""}`}>
        <div className={`${classes.blurBg}`}></div>
        <div
          className={`container max-w-[800px] flex justify-between h-full items-center`}
        >
          <div className="flex flex-grow">
            <div className="w-[44px] h-[44px] flex-shrink-0">
              <Image src={currentSongData?.song.image_url} className="rounded-full " />
            </div>

            <div className="flex-grow  ml-[10px]">
              {currentSongData?.song.song_url && (
                <>
                  <div className="h-[30px] relative overflow-hidden">
                    <div className="absolute left-0 whitespace-nowrap font-playwriteCU leading-[1.5]">
                      {currentSongData?.song.name || "name"}
                    </div>
                  </div>
                  <p className={`opacity-70 line-clamp-1`}>
                    {currentSongData?.song.singer || "singer"}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* cta */}
          <div className={`ml-2 ${!currentSongData?.song.name && "disable"}`}>
            <button className={`p-[4px]`} onClick={handlePlayPause}>
              {renderIcon}
            </button>
          </div>
        </div>
        right
      </div>
    </>
  );
});

const PlayerContent = () => {
  // store
  const { currentSongData, currentQueueId } = useSelector(selectSongQueue);
  const { audioRef, setIsHasAudioEle, controlRef } = usePlayerContext();

  useEffect(() => {
    if (audioRef.current) setIsHasAudioEle(true);
  }, []);

  useEffect(() => {
    controlRef.current?.pause();
  }, [currentQueueId]);

  return (
    <>
      <audio ref={audioRef} src={currentSongData?.song.song_url} className="hidden" />
      {audioRef.current && (
        <>
          <PlayerControl ref={controlRef} audioEle={audioRef.current} />
        </>
      )}
    </>
  );
};

export default function DashboardPlayer() {
  return (
    <PlayerContextProvider>
      <PlayerContent />
    </PlayerContextProvider>
  );
}
