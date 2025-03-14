import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { Button } from "../../_components";

import AddSingerModal from "./AddSingerModal";

export default function AddSingerBtn() {
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className={`h-[32px]  space-x-1 px-2.5`}
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add new singer</div>
      </Button>

      <Modal ref={modalRef} variant="animation">
        <AddSingerModal closeModal={closeModal} variant="add" />
      </Modal>
    </>
  );
}
