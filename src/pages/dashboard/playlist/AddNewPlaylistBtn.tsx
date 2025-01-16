import { AddPlaylist, Button, Modal } from "@/components";
import { ModalRef } from "@/components/Modal";
import usePlaylistActions from "@/hooks/usePlaylistActions";
import { useTheme } from "@/store";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

export default function AddNewPlaylistBtn() {
  const { theme } = useTheme();

  const { addPlaylist } = usePlaylistActions();
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className={`${theme.content_bg} h-[32px] rounded-full space-x-1 px-2.5`}
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add new playlist</div>
      </Button>

      <Modal ref={modalRef} variant="animation">
        <AddPlaylist
          addPlaylist={addPlaylist}
          isFetching={false}
          close={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}
