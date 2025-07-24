import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { useRef } from "react";
import useCategoryLobbyAction from "../hooks/useCategoryLobbyAction";
import { Modal, ModalRef } from "@/components";
import AddCategoryModal from "./AddCategoryModal";

type Props = {
  sectionIndex: number;
};

export default function AddNewCategoryBtn({ sectionIndex }: Props) {
  const { action, isFetching } = useCategoryLobbyAction();

  const modalRef = useRef<ModalRef>(null);

  const handleSubmit = async (payload: CategorySchema) => {
    await action({ type: "add-category", category: payload, sectionIndex });
    modalRef.current?.close();
  };

  return (
    <>
      <Button
        onClick={() => modalRef.current?.open()}
        className="p-1"
        size={"clear"}
      >
        <PlusIcon className="w-6" />
        <span>Add new category</span>
      </Button>

      <Modal variant="animation" ref={modalRef}>
        <AddCategoryModal
          closeModal={() => modalRef.current?.close()}
          isLoading={isFetching}
          variant="add"
          submit={handleSubmit}
        />
      </Modal>
    </>
  );
}
