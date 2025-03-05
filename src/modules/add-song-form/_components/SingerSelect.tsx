import { PlusIcon } from "@heroicons/react/20/solid";
import { useThemeContext } from "@/stores";
import { useRef } from "react";
import { Button, Modal, ModalRef } from "@/components";

export default function SingerSelect() {
  const { theme } = useThemeContext();

  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <div className="space-y-1.5">
        <div className="flex space-x-2 items-center">
          <span>Singer</span>

          <Button color="primary" className={`p-1`} size={"clear"}>
            <PlusIcon className="w-5" />
          </Button>
        </div>

        <div className={`bg-${theme.alpha} p-2 rounded`}></div>
      </div>

      <Modal variant="animation" ref={modalRef}>
        asdlf
      </Modal>
    </>
  );
}
