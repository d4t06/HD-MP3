import { ElementRef, useRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { BackBtn, Button } from "../components";
import { useTheme } from "../store";
import LyricEditorControl, { LyricEditorControlRef } from "./LyricEditorControl";
import LyricEditorList from "./LyricEditorList";
import { Center } from "./ui/Center";
import useLyricEditor from "@/hooks/useLyricEditor";

type Props = {
  admin?: boolean;
};

export type LyricStatus = "active" | "done" | "coming";

export default function LyricEditor({ admin }: Props) {
  const { theme } = useTheme();

  const controlRef = useRef<LyricEditorControlRef>(null);
  const audioRef = useRef<ElementRef<"audio">>(null);

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
            <div className="mt-3">
              <BackBtn variant={admin ?  "admin-playlist" : "my-playlist"} />
            </div>

            <h1 className="text-xl font-playwriteCU mt-3 leading-[2.2]">
              Edit lyric - {song?.name}
            </h1>

            <div className="mt-3">
              {audioRef.current && (
                <LyricEditorControl audioEle={audioRef.current} ref={controlRef} />
              )}
            </div>

            <LyricEditorList controlRef={controlRef} />

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

      {/* <Modal variant="animation" ref={modalRef} >
      <ConfirmModal
            loading={no}
            label={"Your change not save"}
            theme={theme}
            buttonLabel="Close and don't save"
            callback={navigateBack}
            close={closeModal}
          />
      </Modal> */}
    </>
  );
}
