import { Label, Modal, ModalRef } from "@/components";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import SingerSearchModal from "@/modules/add-song-form/_components/SingerSearchModal";
import { Button, ItemRightCtaFrame } from "@/pages/dashboard/_components";
import { useAddAlbumContext } from "../AddAlbumContext";

export default function AlbumSingerSelect() {
  const { singer, setSinger, albumData } = useAddAlbumContext();

  const modalRef = useRef<ModalRef>(null);

  const handleChooseSinger = (s: Singer) => {
    setSinger(s);
    modalRef.current?.close();
  };

  if (!albumData) return;

  return (
    <>
      <div className="flex items-center space-x-1.5">
        <Label>Singer</Label>

        {singer ? (
          <ItemRightCtaFrame className="mt-0">
            <span>{singer.name}</span>

            <div>
              <button onClick={() => setSinger(undefined)}>
                <TrashIcon className="w-5" />
              </button>
            </div>
          </ItemRightCtaFrame>
        ) : (
          <Button
            size={"clear"}
            className="p-1.5"
            onClick={() => modalRef.current?.open()}
          >
            <PlusIcon className="w-5" />
          </Button>
        )}
      </div>

      <Modal variant="animation" ref={modalRef}>
        <SingerSearchModal
          choose={handleChooseSinger}
          closeModal={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}
