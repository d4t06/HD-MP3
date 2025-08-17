import { Ref, forwardRef, useImperativeHandle, useRef } from "react";
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
import { AudioSetting, Button, Modal, ModalRef } from "@/components";
import { useLyricEditorAction } from "../_hooks/useLyricEditorAction";
import MenuBtn from "./MenuBtn";
import { useEditLyricContext } from "./EditLyricContext";
import SyncLyricModal from "./SyncLyricModal";

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
  const { lyrics, viewMode, setViewMode } = useEditLyricContext();

  const modalRef = useRef<ModalRef>(null);

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
  } = useAudioControl({ audioEle });

  const { addLyric, removeLyric, isEnableAddBtn, submit } =
    useLyricEditorAction({
      audioEle,
      isClickPlay,
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
      <div className="flex items-start flex-wrap -mt-2 -ml-2 [&_svg]:w-6 [&_button]:outline-none [&_button]:ml-2 [&_button]:mt-2">
        <AudioSetting
          className="mt-2 ml-2"
          audioEle={audioEle}
          postLocalStorageKey="edit_lyric"
        />

        <Button color="primary" onClick={_handlePlayPaused}>
          {renderPlayPausedButton()}
        </Button>

        {viewMode === "edit" && (
          <>
            <Button
              disabled={!isEnableAddBtn}
              onClick={addLyric}
              color="primary"
            >
              <PlusIcon />
              <span>Add</span>
            </Button>
            <Button
              disabled={!lyrics.length}
              onClick={removeLyric}
              color="primary"
            >
              <MinusIcon />
              <span>Remove</span>
            </Button>

            <Button onClick={() => backward(2)} color="primary">
              <BackwardIcon />
              <span>2s</span>
            </Button>
            <Button onClick={() => forward(2)} color="primary">
              <span>2s</span>
              <ForwardIcon />
            </Button>
          </>
        )}

        {viewMode !== "import" && (
          <Button
            disabled={!lyrics.length}
            onClick={() => {
              viewMode === "edit"
                ? setViewMode("preview")
                : setViewMode("edit");
              pause();
            }}
            color="primary"
          >
            <EyeIcon />
            <span>{viewMode === "preview" ? "Preview" : "Edit"}</span>
          </Button>
        )}

        {viewMode === "import" && (
          <>
            <Button color="primary" onClick={() => modalRef.current?.open()}>
              <ArrowPathIcon />
              <span>Sync lyric</span>
            </Button>
          </>
        )}

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
          style={{ backgroundColor: "var(--a-5-cl)" }}
          className={`h-1 rounded-full w-full progress-line`}
        ></div>

        <div className="text-sm w-[50px] text-right" ref={durationRef}>
          00:00
        </div>
      </div>

      <Modal variant="animation" ref={modalRef}>
        <SyncLyricModal closeModal={() => modalRef.current?.close()} />
      </Modal>
    </>
  );
}

export default forwardRef(LyricEditorControl);
