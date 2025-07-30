import { ElementRef, ReactNode, useRef, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import LyricEditorControl, {
  LyricEditorControlRef,
} from "./_components/LyricEditorControl";
import LyricEditorList from "./_components/LyricEditorList";
// import { useThemeContext } from "@/stores";
import { Center, Modal, ModalRef, Button } from "@/components";
import useLyricEditor from "./_hooks/useLyricEditor";
import EditLyricModal from "../edit-lyric-modal";
import EditLyricProvider from "./_components/EditLyricContext";

type Modal = "edit-lyric";

export type LyricStatus = "active" | "done" | "coming";

function Content({ children }: Props) {
  // const { theme } = useThemeContext();

  const [modal, setModal] = useState<Modal | "">("");

  const controlRef = useRef<LyricEditorControlRef>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const modalRef = useRef<ModalRef>(null);

  const { isFetching, isChanged, song, isSubmitting } = useLyricEditor({
    audioRef,
  });

  const handleSubmit = () => {
    controlRef.current?.pause();
    controlRef.current?.submit();
  };

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <audio className="hidden" ref={audioRef} src={song?.song_url}></audio>
      {isFetching ? (
        <Center>
          <ArrowPathIcon className="w-6 animate-spin" />
        </Center>
      ) : (
        song && (
          <div className="flex-grow flex flex-col overflow-hidden">
            {children}

            {/*<Title title={` Edit lyric - ${song?.name}`} />*/}

            <div className="mt-3">
              {audioRef.current && (
                <>
                  <LyricEditorControl
                    audioEle={audioRef.current}
                    ref={controlRef}
                  />

                  <Modal persisted variant="animation" ref={modalRef}>
                    {modal === "edit-lyric" && (
                      <EditLyricModal closeModal={closeModal} />
                    )}
                  </Modal>
                </>
              )}
            </div>

            {audioRef.current && (
              <LyricEditorList
                controlRef={controlRef}
                audioEle={audioRef.current}
                openEditModal={() => {
                  openModal("edit-lyric");
                }}
              />
            )}

            <Button
              className={`self-end md:self-start rounded-full mt-5 `}
              color="primary"
              disabled={!isChanged}
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        )
      )}
    </>
  );
}

type Props = {
  children?: ReactNode;
};

export default function LyricEditor(props: Props) {
  return (
    <EditLyricProvider>
      <Content {...props} />
    </EditLyricProvider>
  );
}
