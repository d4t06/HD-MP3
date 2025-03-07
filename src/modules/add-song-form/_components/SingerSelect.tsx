import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { Modal, ModalRef } from "@/components";
import SingerSearchModal from "./SingerSearchModal";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { Button, Frame } from "@/pages/dashboard/_components";

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
      <div className="space-y-1.5">
        <div className="flex space-x-2 items-center">
          <span>Singer</span>

          <Button
            onClick={() => modalRef.current?.open()}
            className={`p-1`}
            size={"clear"}
          >
            <PlusIcon className="w-5" />
          </Button>
        </div>

        <Frame className="flex flex-wrap space-x-2">
          {singers.length
            ? singers.map((s, i) => (
                <button
                  onClick={() => selectSinger(s)}
                  className="px-2 py-1 hover:border-red-300 rounded-md border border-black/10"
                  key={i}
                >
                  {s.name}
                </button>
              ))
            : "..."}
        </Frame>
      </div>

      <Modal wrapped={false} variant="animation" ref={modalRef}>
        <SingerSearchModal closeModal={closeModal} choose={handleChoose} />
      </Modal>
    </>
  );
}
