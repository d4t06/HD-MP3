import { ModalContentWrapper, ModalHeader, ModalRef } from "@/components";
import AddAlbumForm from "@/modules/add-album-form";
import { Button, DashboardModal } from "@/pages/dashboard/_components";
import { useAuthContext } from "@/stores";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function AddAlbumBtn() {
  const { user } = useAuthContext();
  const { singer, setAlbums } = useSingerContext();

  const modalRef = useRef<ModalRef>(null);

  const handleAddAlbumToList = (album: Playlist) => {
    setAlbums((prev) => [album, ...prev]);
  };

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className="px-3 py-1"
        size={"clear"}
      >
        <PlusIcon className="w-5" />
        <span>Add album</span>
      </Button>

      <DashboardModal ref={modalRef}>
        <ModalContentWrapper className="w-[700px]">
          {user && singer && (
            <>
              <ModalHeader
                title="Add album"
                close={() => modalRef.current?.close()}
              />

              <AddAlbumForm
                className="flex-grow overflow-auto no-scrollbar md:overflow-hidden"
                variant="add"
                singer={singer}
                callback={handleAddAlbumToList}
                user={user}
              />
            </>
          )}
        </ModalContentWrapper>
      </DashboardModal>
    </>
  );
}
