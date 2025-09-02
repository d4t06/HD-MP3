import {
  Button,
  PopupWrapper,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
  ConfirmModal,
} from "@/components";
import { useRef, useState } from "react";
import AddSongBeatModal from "./AddSongBeatModal";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  MusicalNoteIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import EditStringLyicModal from "./EditStringLyricModal";
import { useEditLyricContext } from "./EditLyricContext";
import useImportLyric from "../_hooks/useImportLyric";
import useExportLyric from "../_hooks/useExportLyric";
import SyncLyricModal from "./SyncLyricModal";

type Modal =
  | "lyric"
  | "song-beat"
  | "export"
  | "search"
  | "sync"
  | "discard"
  | "warning-import";

type Props = {
  pause: () => void;
};

export default function MenuBtn({ pause }: Props) {
  const { song, lyrics, viewMode, discard } = useEditLyricContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  const { handleInputChange } = useImportLyric();
  const { exportLyric } = useExportLyric();

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  const renderModal = () => {
    if (!modal) return;

    switch (modal) {
      case "lyric":
        return <EditStringLyicModal modalRef={modalRef} />;

      case "song-beat":
        return song && <AddSongBeatModal closeModal={closeModal} />;
      case "export":
        return (
          <ModalContentWrapper>
            <ModalHeader title="Export" closeModal={closeModal} />

            <div className="flex ">
              <Button
                color="primary"
                onClick={() => exportLyric({ type: "json" })}
              >
                JSON
              </Button>
              <Button
                color="primary"
                onClick={() => exportLyric({ type: "srt" })}
                className="ml-2"
              >
                SRT
              </Button>
            </div>
          </ModalContentWrapper>
        );

      case "sync":
        return <SyncLyricModal closeModal={closeModal} />;
      case "discard":
        return (
          <ConfirmModal
            closeModal={closeModal}
            callback={discard}
            loading={false}
            label="Discard current lyrics"
          />
        );
      case "warning-import":
        return (
          <ConfirmModal
            closeModal={closeModal}
            callback={() => {
              closeModal();
              labelRef.current?.click();
            }}
            loading={false}
            label="Import lyrics ?"
            desc="Your current lyrics will discard"
          />
        );
    }
  };

  return (
    <>
      <label ref={labelRef} htmlFor="import_lyric" className="hidden"></label>

      <input
        id="import_lyric"
        onChange={handleInputChange}
        type="file"
        className="hidden"
      />

      <MyPopup appendOnPortal>
        <MyPopupTrigger>
          <Button
            size={"clear"}
            color="primary"
            className={`h-[36px] w-[36px] justify-center rounded-full mt-2`}
          >
            <Bars3Icon className="w-6" />
          </Button>
        </MyPopupTrigger>

        <MyPopupContent origin="top right">
          <PopupWrapper className="w-[220px]">
            <VerticalMenu cb={pause}>
              {viewMode === "edit" && (
                <button onClick={() => openModal("lyric")}>
                  <PencilIcon />

                  <span>Edit lyric</span>
                </button>
              )}

              <button onClick={() => openModal("discard")}>
                <XMarkIcon />

                <span>Discard lyric</span>
              </button>

              <button onClick={() => openModal("song-beat")}>
                <MusicalNoteIcon />
                <span>Song beat</span>
              </button>

              <button
                onClick={() =>
                  lyrics.length
                    ? openModal("warning-import")
                    : labelRef.current?.click()
                }
              >
                <ArrowDownTrayIcon />
                <span>Import (JSON or SRT)</span>
              </button>

              <button
                disabled={!lyrics.length}
                onClick={() => openModal("export")}
              >
                <ArrowTopRightOnSquareIcon />
                <span>Export</span>
              </button>
            </VerticalMenu>
          </PopupWrapper>
        </MyPopupContent>
      </MyPopup>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
