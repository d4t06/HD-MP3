import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { Button, ModalWrapper } from "../../_components";

import AddSingerModal from "./AddSingerModal";

export default function AddSingerBtn() {
  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className={`self-start p-1.5 ml-5`}
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add new singer</div>
      </Button>

      <Modal wrapped={false} ref={modalRef} variant="animation">
        <ModalWrapper className="w-[unset]">
          <AddSingerModal closeModal={closeModal} variant="add" />
        </ModalWrapper>
      </Modal>
    </>
  );
}
