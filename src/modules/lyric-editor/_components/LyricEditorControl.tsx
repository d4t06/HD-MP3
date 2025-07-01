import { useThemeContext } from "@/stores";
import { Ref, forwardRef, useImperativeHandle } from "react";
import {
  ArrowPathIcon,
  BackwardIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ForwardIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import useAudioControl from "@/hooks/useAudioControl";
import { AudioSetting, Button } from "@/components";
import { useLyricEditorAction } from "../_hooks/useLyricEditorAction";
import MenuBtn from "./MenuBtn";
import { useEditLyricContext } from "./EditLyricContext";

type Props = {
  audioEle: HTMLAudioElement;
};

export type LyricEditorControlRef = {
  seek: (second: number) => void;
  pause: () => void;
  submit: () => Promise<void>;
};

function LyricEditorControl(
  { audioEle }: Props,
  ref: Ref<LyricEditorControlRef>,
) {
  const { theme, themeClass } = useThemeContext();
  const { song, lyrics, isPreview, setIsPreview } = useEditLyricContext();

  const PROGRESS_LINE_BG = themeClass("rgba(0,0,0,.15)", "rgba(255,255,255,.15)")

  const {
    backward,
    forward,
    handlePlayPause,
    currentTimeRef,
    durationRef,
    progressLineRef,
    pause,
    seek,
    status,
    isClickPlay,
  } = useAudioControl({ audioEle, baseColor: PROGRESS_LINE_BG });

  const { addLyric, removeLyric, isEnableAddBtn, submit } =
    useLyricEditorAction({
      audioEle,
      isClickPlay,
      song,
    });

  useImperativeHandle(ref, () => ({ seek, pause, submit }));

  const _handlePlayPaused = () => {
    if (!isClickPlay) {
      if (!!lyrics.length) {
        const latestTime = lyrics[lyrics.length - 1].end;
        audioEle.currentTime = latestTime;
      }
    }
    handlePlayPause();
  };

  const classes = {
    button: `mt-2 ml-2 space-x-1 ${theme.content_bg} rounded-full`,
    icon: "w-6",
    arrow: `before:content-[''] before:absolute before:-translate-x-1/2 before:left-[27px]  before:bottom-[calc(100%-1px)] before:z-[-1] before:border-8 before:border-transparent before:border-b-amber-800`,
  };

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
      <div className="flex items-start flex-wrap -mt-2 -ml-2 [&_button]:outline-none">
        <AudioSetting
          className="mt-2 ml-2"
          audioEle={audioEle}
          postLocalStorageKey="edit_lyric"
        />

        <Button className={classes.button} onClick={_handlePlayPaused}>
          {renderPlayPausedButton()}
        </Button>
        <Button
          disabled={!isEnableAddBtn || isPreview}
          onClick={addLyric}
          className={classes.button}
        >
          <PlusIcon className="w-6" />
          <span>Add</span>
        </Button>
        <Button
          disabled={!lyrics.length || isPreview}
          onClick={removeLyric}
          className={classes.button}
        >
          <MinusIcon className="w-6" />
          <span>Remove</span>
        </Button>

        <Button onClick={() => backward(2)} className={classes.button}>
          <BackwardIcon className="w-6" />
          <span>2s</span>
        </Button>
        <Button onClick={() => forward(2)} className={classes.button}>
          <span>2s</span>
          <ForwardIcon className="w-6" />
        </Button>

        <Button
        disabled={!lyrics.length}
          onClick={() => {
            setIsPreview(!isPreview);
            pause();
          }}
          className={classes.button}
        >
          <EyeIcon className="w-6" />
          <span>{!isPreview ? "Preview" : "Edit"}</span>
        </Button>

        <div className="ml-auto">
          <MenuBtn pause={pause} />
        </div>
      </div>

      <div className="flex items-center mt-3">
        <div className="text-sm w-[50px]" ref={currentTimeRef}>
          00:00
        </div>

        <div
          ref={progressLineRef}
          style={{ backgroundColor: PROGRESS_LINE_BG }}
          className={`h-1 rounded-full w-full progress-line`}
        ></div>

        <div className="text-sm w-[50px] text-right" ref={durationRef}>
          00:00
        </div>
      </div>
    </>
  );
}

export default forwardRef(LyricEditorControl);
