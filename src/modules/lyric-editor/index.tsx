import { ElementRef, ReactNode, useRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import LyricEditorControl, {
  LyricEditorControlRef,
} from "./_components/LyricEditorControl";
import LyricEditorList from "./_components/LyricEditorList";
import { useThemeContext } from "@/stores";
import { Center, Title, Modal, ModalRef, Button } from "@/components";
import useLyricEditor from "./_hooks/useLyricEditor";
import EditLyricModal from "../edit-lyric-modal";
import EditLyricProvider from "./_components/EditLyricContext";

type Props = {
  children?: ReactNode;
};

export type LyricStatus = "active" | "done" | "coming";

function Content({ children }: Props) {
  const { theme } = useThemeContext();

  const controlRef = useRef<LyricEditorControlRef>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const modalRef = useRef<ModalRef>(null);

  const { isFetching, song, isChanged, isSubmitting } = useLyricEditor({
    audioRef,
  });

  const handleSubmit = () => {
    controlRef.current?.pause();
    controlRef.current?.submit();
  };

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

            <Title title={` Edit lyric - ${song?.name}`} />

            <div className="mt-3">
              {audioRef.current && (
                <>
                  <LyricEditorControl audioEle={audioRef.current} ref={controlRef} />

                  <Modal persisted variant="animation" ref={modalRef}>
                    <EditLyricModal closeModal={() => modalRef.current?.close()} />
                  </Modal>
                </>
              )}
            </div>

            <LyricEditorList modalRef={modalRef} controlRef={controlRef} />

            <Button
              className={`${theme.content_bg} font-playwriteCU self-end md:self-start rounded-full mt-5 `}
              variant={"primary"}
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

export default function LyricEditor() {
  return (
    <EditLyricProvider>
      <Content />
    </EditLyricProvider>
  );
}
