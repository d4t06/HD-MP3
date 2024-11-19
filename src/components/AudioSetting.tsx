import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, PopupWrapper } from ".";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "./MyPopup";
import { useTheme } from "@/store";
import usePersistState from "@/hooks/usePersistState";
import { useEffect } from "react";

type Props = { audioEle: HTMLAudioElement; postLocalStorageKey: string };

function useAudioSetting({ audioEle, postLocalStorageKey }: Props) {
  const [speed, setSpeed] = usePersistState<number>(
    1,
    `audio_speed_${postLocalStorageKey}`
  );
  const [volume, setVolume] = usePersistState<number>(
    100,
    `audio_volume_${postLocalStorageKey}`
  );

  useEffect(() => {
    audioEle.volume = volume / 100;
    audioEle.playbackRate = speed;
  }, [volume, speed]);

  return {
    speed,
    setSpeed,
    volume,
    setVolume,
  };
}

export default function AudioSetting({
  className,
  ...props
}: Props & { className?: string }) {
  const { theme } = useTheme();

  const { speed, volume, setVolume, setSpeed } = useAudioSetting(props);

  console.log("render");

  return (
    <MyPopup>
      <MyPopupTrigger>
        <Button className={`${theme.content_bg} rounded-full ${className || ""}`}>
          <Cog6ToothIcon className="w-6" />
        </Button>
      </MyPopupTrigger>

      <MyPopupContent className="top-[calc(100%+8px)] left-0 z-[9]" appendTo="parent">
        <PopupWrapper className="w-[240px]" theme={theme}>
          <div className="space-y-[6px]">
            <div className={`flex space-x-1`}>
              <div className="w-[110px] flex-shrink-0">Speed {speed}x</div>
              <input
                className="w-full"
                type="range"
                step={0.1}
                min={1}
                max={1.5}
                value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
              />
            </div>

            <div className={`flex space-x-1`}>
              <div className="w-[110px] flex-shrink-0">Volume {volume}%</div>
              <input
                className="w-full"
                type="range"
                step={1}
                min={1}
                max={100}
                value={volume}
                onChange={(e) => setVolume(+e.target.value)}
              />
            </div>
          </div>
        </PopupWrapper>
      </MyPopupContent>
    </MyPopup>
  );
}
