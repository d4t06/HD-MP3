import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { ModalRef } from "@/components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { Button } from "@/pages/dashboard/_components";
import ItemRightCtaFrame from "@/pages/dashboard/_components/ui/ItemRightCtaFrame";
import { TrashIcon } from "@heroicons/react/24/outline";
import DashBoardModal from "@/pages/dashboard/_components/ui/Modal";
import SingerSearchModal from "@/modules/singer-search-modal";

export default function SingerSelect() {
  const { singers, selectSinger } = useAddSongContext();

  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  const handleChoose = (s: Singer) => {
    selectSinger(s);
    closeModal();
  };

  return (
    <>
      <div>
        <div>Singer</div>

        <div className="-ml-2 flex flex-wrap">
          {singers.map((s, i) => (
            <ItemRightCtaFrame key={i}>
              <span>{s.name}</span>

              <div className="flex">
                <button onClick={() => selectSinger(s)}>
                  <TrashIcon className="w-5" />
                </button>
              </div>
            </ItemRightCtaFrame>
          ))}

          <Button
            onClick={() => modalRef.current?.open()}
            className="mt-2 ml-2 h-[38px] w-[38px] justify-center"
            size={"clear"}
          >
            <PlusIcon className="w-5" />
          </Button>
        </div>
      </div>

      <DashBoardModal ref={modalRef}>
        <SingerSearchModal closeModal={closeModal} choose={handleChoose} />
      </DashBoardModal>
    </>
  );
}
