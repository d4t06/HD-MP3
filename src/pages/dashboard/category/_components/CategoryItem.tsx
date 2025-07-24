import { ConfirmModal, Modal, ModalRef } from "@/components";
import { useRef, useState } from "react";
import { LinkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ItemRightCtaFrame from "../../_components/ui/ItemRightCtaFrame";
import AddCategoryModal from "./AddCategoryModal";
import useCategoryAction from "../hooks/useCategoryAction";
import { Link } from "react-router-dom";

type Props = {
  category: Category;
};

type Modal = "edit" | "delete";

export default function CategoryItem({ category }: Props) {
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useCategoryAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);

    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <ItemRightCtaFrame>
        <Link to={`/dashboard/category/${category.id}`} className="hover:underline">
          {category.name}
        </Link>

        <div>
          <button className="" onClick={() => openModal("edit")}>
            <PencilIcon className="w-5" />
          </button>
          <button onClick={() => openModal("delete")}>
            <TrashIcon className="w-5" />
          </button>
        </div>
      </ItemRightCtaFrame>

      <Modal variant="animation" ref={modalRef}>
        {modal === "edit" && (
          <AddCategoryModal
            variant="edit"
            category={category}
            closeModal={closeModal}
            isLoading={isFetching}
            submit={(c) =>
              action({ type: "edit", category: c, id: category.id })
            }
          />
        )}

        {modal === "delete" && (
          <ConfirmModal
            callback={() => action({ type: "delete", id: category.id })}
            close={closeModal}
            loading={isFetching}
            label={`Delete genre '${category.name}'`}
          />
        )}
      </Modal>
    </>
  );
}
