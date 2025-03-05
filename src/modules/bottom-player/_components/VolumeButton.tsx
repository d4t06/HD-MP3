import useVolume from "@/hooks/useVolume";
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

  const classes = {
    before: `before:content-[''] before:w-[100%] before:h-[16px] before:absolute before:top-[50%] before:translate-y-[-50%]`,
    volumeLineBase: `ml-1 w-full relative h-[4px] cursor-pointer rounded-full shadow-[2px_2px_10px_rgba(0,0,0,.15)]`,
  };

  return (
    <div className="flex flex-grow items-center max-w-[120px] mr-2">
      <button onWheel={handleWheel} onClick={() => handleMute()}>
        {isMute ? (
          <SpeakerXMarkIcon className="w-6" />
        ) : (
          <SpeakerWaveIcon className="w-6" />
        )}
      </button>
      <div
        onClick={(e) => handleSetVolume(e)}
        ref={volumeLineRef}
        className={`${classes.volumeLineBase} ${classes.before}`}
        style={{ background: `#e1e1e1` }}
      ></div>
    </div>
  );
}
