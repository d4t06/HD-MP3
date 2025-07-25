import {
  Button,
  MenuWrapper,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
} from "@/components";
import { useThemeContext } from "@/stores";
import { useRef, useState } from "react";
import AddSongBeatModal from "./AddSongBeatModal";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import EditStringLyicModal from "./EditStringLyricModal";
import { useEditLyricContext } from "./EditLyricContext";
import useImportLyric from "../_hooks/useImportLyric";
import useExportLyric from "../_hooks/useExportLyric";
import SearchLyricModal from "./SearchLyricModal";

type Modal = "lyric" | "song-beat" | "export" | "search";

type Props = {
  pause: () => void;
};

export default function MenuBtn({ pause }: Props) {
  const { theme } = useThemeContext();
  const { song, lyrics } = useEditLyricContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { handleInputChange } = useImportLyric();
  const { exportLyric } = useExportLyric();

  const openModal = (m: Modal) => {
    pause();
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  const renderModal = () => {
    if (!modal) return;

    switch (modal) {
      case "lyric":
        return <EditStringLyicModal closeModal={closeModal} />;

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
                JRC
              </Button>
            </div>
          </ModalContentWrapper>
        );

      case "search":
        return <SearchLyricModal closeModal={closeModal} />;
    }
  };

  return (
    <>
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
            className={`${theme.content_bg} h-[36px] w-[36px] justify-center rounded-full mt-2`}
          >
            <Bars3Icon className="w-6" />
          </Button>
        </MyPopupTrigger>

        <MyPopupContent origin="top right">
          <MenuWrapper className="w-[160px]">
            <VerticalMenu>
              <button onClick={() => openModal("lyric")}>
                <PencilIcon />

                <span>Edit lyric</span>
              </button>
              {!song?.is_official && (
                <button onClick={() => openModal("search")}>
                  <MagnifyingGlassIcon />

                  <span>Search lyric</span>
                </button>
              )}

              <button onClick={() => openModal("song-beat")}>
                <MusicalNoteIcon />
                <span>Song beat</span>
              </button>

              <button className="!p-0">
                <label
                  className="flex w-full px-3 py-2 cursor-pointer items-center space-x-2"
                  htmlFor="import_lyric"
                >
                  <ArrowDownTrayIcon />
                  <span>Import</span>
                </label>
              </button>

              <button
                disabled={!lyrics.length}
                onClick={() => openModal("export")}
              >
                <ArrowTopRightOnSquareIcon />
                <span>Export</span>
              </button>
            </VerticalMenu>
          </MenuWrapper>
        </MyPopupContent>
      </MyPopup>

      <Modal variant="animation" ref={modalRef}>
        {renderModal()}
      </Modal>
    </>
  );
}
