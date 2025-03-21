import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Button } from "../../_components";
import AddGenreModal from "./AddGenreModal";

export default function AddNewGenreButton() {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className={`p-1.5 ml-5`}
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <div className="hidden md:block">Add genre</div>
      </Button>

      <Modal ref={modalRef} variant="animation" wrapped={false}>
        <AddGenreModal type="add" closeModal={() => modalRef.current?.close()} />
      </Modal>
    </>
  );
}
