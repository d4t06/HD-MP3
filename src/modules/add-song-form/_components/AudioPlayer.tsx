import { Button, Frame } from "@/components/dashboard";
import { useAudioControl } from "@/hooks";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { ElementRef, useRef } from "react";
import UploadSongBtn from "./UploadSongBtn";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function AudioPLayer({ audioEle }: Props) {
  const progressLineRef = useRef<ElementRef<"div">>(null);

  const { status, handlePlayPause } = useAudioControl({ audioEle, progressLineRef });

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
        <div
          ref={progressLineRef}
          style={{ backgroundColor: "rgba(255,255,255,.3)" }}
          className={`h-1 rounded-full mt-3 w-full`}
        ></div>
      </Frame>
    </>
  );
}
