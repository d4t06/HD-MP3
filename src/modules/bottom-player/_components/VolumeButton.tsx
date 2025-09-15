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
    <>
      <div className="relative group before:absolute before:left-0 before:w-full before:bottom-full before:h-2">
        <button
          className=" rounded-full"
          onWheel={handleWheel}
          onClick={() => handleMute()}
        >
          {isMute ? (
            <SpeakerXMarkIcon className="w-5" />
          ) : (
            <SpeakerWaveIcon className="w-5" />
          )}
        </button>

        <div className="absolute hidden group-hover:block rounded-full py-2 px-3 bg-[--popup-cl] bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[100px]">
          <ProgressBar
            className="h-1 w-full"
            onClick={handleSetVolume}
            elelRef={volumeLineRef}
          />
        </div>
      </div>
    </>
  );
}
