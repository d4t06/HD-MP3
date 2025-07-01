import { useAudioControl } from "@/hooks";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/pages/dashboard/_components";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function AudioPLayer({ audioEle }: Props) {
  const {
    status,
    handlePlayPause,
    progressLineRef,
    currentTimeRef,
    durationRef,
  } = useAudioControl({
    audioEle,
    baseColor: "rgba(0,0,0,.15)",
    color: "#5a9e87",
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
      <div className="flex items-end justify-between">
        <Button className={`p-1.5`} size={"clear"} onClick={handlePlayPause}>
          {renderPlayPausedButton()}
        </Button>

        <div className="flex flex-grow items-center ml-4">
          <div className="text-sm w-[50px]" ref={currentTimeRef}>
            00:00
          </div>

          <div
            ref={progressLineRef}
            style={{ backgroundColor: "rgba(0,0,0,.15)" }}
            className={`h-1 rounded-full w-full progress-line`}
          ></div>

          <div className="text-sm w-[50px] text-right" ref={durationRef}>
            00:00
          </div>
        </div>
      </div>
    </>
  );
}
