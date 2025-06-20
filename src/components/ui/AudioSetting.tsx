import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, PopupWrapper } from "..";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "../MyPopup";
import { useThemeContext } from "@/stores";
import usePersistState from "@/hooks/usePersistState";
import { useEffect } from "react";

type Props = {
  audioEle: HTMLAudioElement;
  postLocalStorageKey: string;
  className?: string;
  positions?: "left" | "right";
  bg?: string;
};

function useAudioSetting({ audioEle, postLocalStorageKey }: Props) {
  const [speed, setSpeed] = usePersistState<number>(
    `audio_speed_${postLocalStorageKey}`,
    1,
  );
  const [volume, setVolume] = usePersistState<number>(
    `audio_volume_${postLocalStorageKey}`,
    100,
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
  className = "",
  positions = "right",
  bg = "",
  ...props
}: Props) {
  const { theme } = useThemeContext();

  const { speed, volume, setVolume, setSpeed } = useAudioSetting(props);

  return (
    <MyPopup appendOnPortal>
      <MyPopupTrigger>
        <Button className={`${theme.content_bg} rounded-full ${className}`}>
          <Cog6ToothIcon className="w-6" />
        </Button>
      </MyPopupTrigger>

      <MyPopupContent
        {...(positions === "right"
          ? { position: "right-bottom", origin: "top left" }
          : { position: "left-bottom", origin: "top right" })}
        appendTo="portal"
      >
        <PopupWrapper
          bg="clear"
          className={`w-[240px] ${bg ? bg : theme.modal_bg} `}
          theme={theme}
        >
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
