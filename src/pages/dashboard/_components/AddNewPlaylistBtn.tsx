import { Button, Modal } from "@/components";
import { ModalRef } from "@/components/Modal";
import { useThemeContext } from "@/stores";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import AddItem from "@/components/modals/AddItem";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";

export default function AddNewPlaylistBtn() {
  const { theme } = useThemeContext();

  const { actions, isFetching } = useDashboardPlaylistActions();
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  const handleAddPlaylist = async (v: string) => {
    await actions({
      variant: "add-playlist",
      name: v,
    });
    closeModal();
  };

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
        <AddItem
          loading={isFetching}
          closeModal={closeModal}
          cbWhenSubmit={(v) => handleAddPlaylist(v)}
          title="Add playlist"
        />
      </Modal>
    </>
  );
}
