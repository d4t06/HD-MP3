import { useImperativeHandle } from "react";
import {
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { usePlayerContext } from "./PlayerContext";
import { ArrowPathIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import uesAudioEffect from "../_hooks/useAudioEffect";
import SongItemCta from "./SongItemCta";
import { useAudioControl } from "@/hooks";

type Props = {
  audioEle: HTMLAudioElement;
  song: Song;
};

export default function SongControl({ audioEle, song }: Props) {
  const { status, controlRef, setStatus, statusRef } = usePlayerContext();

  uesAudioEffect({ audioEle });

  const { pause, play, handlePlayPause, progressLineRef } = useAudioControl({
    audioEle,
    setStatusFromParent: setStatus,
    statusFromParent: status,
    statusRefFromParent: statusRef,
  });

  useImperativeHandle(controlRef, () => ({
    pause,
    play,
    handlePlayPause,
  }));

  const renderIcon = () => {
    switch (status) {
      case "playing":
        return <PauseIcon />;
      case "paused":
        return <PlayIcon />;
      case "error":
        return <ExclamationCircleIcon />;
      case "loading":
        return <ArrowPathIcon className="animate-spin" />;

      default:
        return <MusicalNoteIcon />;
    }
  };



  return (
    <>
      <div className="flex">
        <button onClick={handlePlayPause} className="[&_svg]:w-7">
          {renderIcon()}
        </button>

        <div className="flex space-x-2 ml-auto">
          <SongItemCta song={song} />
        </div>
      </div>
      <div className="h-2 flex items-center mt-3">
        <div
          ref={progressLineRef}
          style={{ backgroundColor: "rgba(255,255,255,.3)" }}
          className={`relative h-1 rounded-full w-full progress-line ${status === "idle" ? "hidden" : ""}`}
        ></div>
      </div>
    </>
  );
}
