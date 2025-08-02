import { ProgressBar } from "@/components";
import useVolume from "../_hooks/useVolume";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { ElementRef, useRef } from "react";

type Props = {
  audioEle: HTMLAudioElement;
};

export function VolumeButton({ audioEle }: Props) {
  const volumeLineRef = useRef<ElementRef<"div">>(null);

  const { handleMute, handleWheel, handleSetVolume, isMute } = useVolume({
    audioEle,
    volumeLineRef,
  });

  return (
    <div className="flex flex-grow items-center mr-2">
      <button onWheel={handleWheel} onClick={() => handleMute()}>
        {isMute ? (
          <SpeakerXMarkIcon className="w-6" />
        ) : (
          <SpeakerWaveIcon className="w-6" />
        )}
      </button>

      <ProgressBar className="h-1 ml-1" onClick={handleSetVolume} elelRef={volumeLineRef} />
    </div>
  );
}
