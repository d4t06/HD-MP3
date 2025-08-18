import { Ref, forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
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
import EditStringLyricModal from "./EditStringLyricModal";

type Props = {
  audioEle: HTMLAudioElement;
};

type Modal = "lyric" | "sync";

export type LyricEditorControlRef = {
  seek: (second: number) => void;
  pause: () => void;
  submit: () => Promise<void>;
};

function LyricEditorControl(
  { audioEle }: Props,
  ref: Ref<LyricEditorControlRef>,
) {
  const { lyrics, viewMode, baseLyric, setViewMode } = useEditLyricContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();

    pause();
  };

  const {
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
        {viewMode === "edit" && !!baseLyric && (
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
          </>
        )}

        {viewMode === "edit" && !!baseLyric && (
          <Button onClick={() => openModal("lyric")} color="primary">
            <span>Lyric</span>
          </Button>
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
            <span>{viewMode === "preview" ? "Preview" : "Edit"}</span>
          </Button>
        )}
        {viewMode === "import" && (
          <>
            <Button
              color="primary"
              onClick={() => {
                openModal("sync");
              }}
            >
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
        {modal === "sync" && (
          <SyncLyricModal closeModal={() => modalRef.current?.close()} />
        )}

        {modal === "lyric" && <EditStringLyricModal modalRef={modalRef} />}
      </Modal>
    </>
  );
}

export default forwardRef(LyricEditorControl);
