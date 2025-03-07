import { useAudioControl } from "@/hooks";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, useRef } from "react";
import UploadSongBtn from "./UploadSongBtn";
import { Button, Frame } from "@/pages/dashboard/_components";
import { formatTime } from "@/utils/appHelpers";

type Props = {
  audioEle: HTMLAudioElement;
  duration: number;
};

export default function AudioPLayer({ audioEle, duration }: Props) {
  const progressLineRef = useRef<ElementRef<"div">>(null);

  const { status, handlePlayPause } = useAudioControl({
    audioEle,
    baseColor: "rgba(0,0,0,.10)",
    color: "#5a9e87",
    progressLineRef,
  });

  const renderPlayPausedButton = () => {
    switch (status) {
      case "error":
        return <ExclamationCircleIcon className="w-6" />;
      case "playing":
        return <PauseIcon className="w-6" />;

      case "paused":
        return <PlayIcon className="w-6" />;

      case "waiting":
        return <ArrowPathIcon className="w-6 animate-spin" />;
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <Button className={`p-1`} size={"clear"} onClick={handlePlayPause}>
          {renderPlayPausedButton()}
        </Button>

        <UploadSongBtn />
      </div>

      <Frame>
        <span>{formatTime(duration)}</span>
        <div ref={progressLineRef} className={`h-1 rounded-full mt-3 w-full`}></div>
      </Frame>
    </>
  );
}
