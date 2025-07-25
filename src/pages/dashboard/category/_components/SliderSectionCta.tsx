import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { useRef, useState } from "react";
import { ArrangeModal, Modal, ModalRef } from "@/components";
import CategorySelectModal from "./CategorySelectModal";
import useSliderSectionAction from "../hooks/useSliderSectionAction";

type Props = {
  orderedCategories: Category[];
};

type Modal = "add" | "arrange";

export default function SliderSectionCta({ orderedCategories }: Props) {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useSliderSectionAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <div className="flex space-x-2 justify-center mt-3">
        <Button onClick={() => openModal("add")} className="p-1" size={"clear"}>
          <PlusIcon className="w-6" />
          <span>Add</span>
        </Button>

        <Button
          onClick={() => openModal("arrange")}
          className="p-1"
          disabled={orderedCategories.length < 2}
          size={"clear"}
        >
          <ArrowPathIcon className="w-6" />
          <span>Arrange</span>
        </Button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {modal === "add" && (
          <CategorySelectModal
            choose={(c) => action({ variant: "add-category", categories: [c] })}
            closeModal={closeModal}
          />
        )}

        {modal === "arrange" && (
          <ArrangeModal
            closeModal={closeModal}
            isLoading={isFetching}
            data={orderedCategories.map((p) => ({ id: p.id, label: p.name }))}
            submit={(order) =>
              action({
                variant: "arrange",
                order,
              })
            }
          />
        )}
      </Modal>
    </>
  );
}
