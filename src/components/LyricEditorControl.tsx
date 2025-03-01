import { useThemeContext } from "@/stores";
import {
  ElementRef,
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, Modal } from ".";
import {
  ArrowPathIcon,
  BackwardIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ForwardIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import useAudioControl from "@/hooks/useAudioControl";
import { ModalRef } from "./Modal";
import { useEditLyricContext } from "@/stores/EditLyricContext";
import { useLyricEditorAction } from "@/hooks/useLyricEditorAction";
import InputModal from "./modals/InputModal";
import ModalHeader from "./modals/ModalHeader";
import tutorial from "@/assets/tutorial/tutorial1.png";
import AudioSetting from "./AudioSetting";

type Props = {
  audioEle: HTMLAudioElement;
};

export type LyricEditorControlRef = {
  seek: (second: number) => void;
  pause: () => void;
  submit: () => Promise<void>;
};

type Modal = "base-lyric" | "tutorial";

function LyricEditorControl({ audioEle }: Props, ref: Ref<LyricEditorControlRef>) {
  const { theme } = useThemeContext();
  const { baseLyric, setBaseLyric, setIsChanged, song, lyrics } = useEditLyricContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);
  const progressLineRef = useRef<ElementRef<"div">>(null);

  const { backward, forward, handlePlayPause, pause, seek, status, isClickPlay } =
    useAudioControl({ audioEle, progressLineRef });

  const { addLyric, removeLyric, isEnableAddBtn, submit } = useLyricEditorAction({
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

  const closeModal = () => modalRef.current?.toggle();

  const openModal = (modal: Modal) => {
    setModal(modal);
    modalRef.current?.toggle();
  };

  const renderModal = () => {
    if (!modal) return;

    switch (modal) {
      case "base-lyric":
        return (
          <InputModal
            variant="text-area"
            title="Edit lyric"
            initValue={baseLyric}
            submit={handleSetBaseLyric}
          />
        );
      case "tutorial":
        return (
          <div className="w-[500px] max-w-[90vw]">
            <ModalHeader title="Tutorial" close={closeModal} />
            <div className="h-[500px] max-h-[75vh] overflow-y-auto no-scrollbar">
              <img className="w-full border rounded-[16px]" src={tutorial} alt="" />
            </div>
          </div>
        );
    }
  };

  const handleSetBaseLyric = (value: string) => {
    setBaseLyric(value);
    setIsChanged(true);
    closeModal();
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
      <div className="flex items-start flex-wrap -mt-2 -ml-2">
        <AudioSetting
          className="mt-2 ml-2"
          audioEle={audioEle}
          postLocalStorageKey="edit_lyric"
        />

        <Button className={classes.button} onClick={_handlePlayPaused}>
          {renderPlayPausedButton()}
        </Button>
        <Button disabled={!isEnableAddBtn} onClick={addLyric} className={classes.button}>
          <PlusIcon className="w-6" />
          <span>Add</span>
        </Button>
        <Button
          disabled={!lyrics.length}
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
        <Button onClick={() => openModal("base-lyric")} className={classes.button}>
          <DocumentTextIcon className="w-6" />
          <span>Edit lyric</span>
        </Button>

        <button
          onClick={() => openModal("tutorial")}
          className={`self-center ml-auto mt-2`}
        >
          <QuestionMarkCircleIcon className="w-6" />
        </button>
      </div>

      <div
        ref={progressLineRef}
        style={{ backgroundColor: "rgba(255,255,255,.3)" }}
        className={`h-1 rounded-full mt-3 w-full`}
      ></div>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}

export default forwardRef(LyricEditorControl);
