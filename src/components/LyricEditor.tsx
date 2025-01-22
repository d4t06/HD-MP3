import { ElementRef, ReactNode, useRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "../components";
import { useTheme } from "../store";
import LyricEditorControl, { LyricEditorControlRef } from "./LyricEditorControl";
import LyricEditorList from "./LyricEditorList";
import { Center } from "./ui/Center";
import useLyricEditor from "@/hooks/useLyricEditor";
import EditLyricModal from "./modals/EditLyricModal";
import Modal, { ModalRef } from "./Modal";
import Title from "./ui/Title";

type Props = {
  admin?: boolean;
  children?: ReactNode;
};

export type LyricStatus = "active" | "done" | "coming";

export default function LyricEditor({ admin, children }: Props) {
  const { theme } = useTheme();

  const controlRef = useRef<LyricEditorControlRef>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const modalRef = useRef<ModalRef>(null);

  const { isFetching, song, isChanged, isSubmitting } = useLyricEditor({
    audioRef,
    admin,
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
          <div className="flex flex-col h-full pb-5">
            {children}

            <Title title={` Edit lyric - ${song?.name}`} />

            <div className="mt-3">
              {audioRef.current && (
                <>
                  <LyricEditorControl audioEle={audioRef.current} ref={controlRef} />

                  <Modal variant="animation" ref={modalRef}>
                    <EditLyricModal closeModal={() => modalRef.current?.close()} />
                  </Modal>
                </>
              )}
            </div>

            <LyricEditorList modalRef={modalRef} controlRef={controlRef} />

            <Button
              className={`${theme.content_bg} font-playwriteCU self-start rounded-full mt-5 `}
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
