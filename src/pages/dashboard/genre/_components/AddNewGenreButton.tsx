import { Modal, ModalRef } from "@/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Button } from "../../_components";
import AddGenreModal from "./AddGenreModal";

type Props = {
  value: string;
};

export default function AddNewGenreButton({ value }: Props) {
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

      <Modal ref={modalRef} variant="animation">
        <AddGenreModal
          genreName={value}
          type="add"
          closeModal={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}
