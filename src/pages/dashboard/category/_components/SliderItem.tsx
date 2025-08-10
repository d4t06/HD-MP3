import { ConfirmModal, Image, Modal, ModalRef } from "@/components";
import { useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import ItemRightCtaFrame from "../../_components/ui/ItemRightCtaFrame";
// import useCategoryAction from "../hooks/useCategoryAction";
import { Link } from "react-router-dom";
import useSliderSectionAction from "../hooks/useSliderSectionAction";

type Props = {
  category: Category;
};

type Modal = "delete";

export default function SliderItem({ category }: Props) {
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
      <div>
        <div className="aspect-[16/4]">
          <Image
            src={category.banner_image_url}
            blurHashEncode={category.banner_blurhash_encode}
            className="rounded-md h-full object-cover"
          />
        </div>
        <ItemRightCtaFrame margin={false} className="w-fit mx-auto mt-2">
          <Link
            to={`/dashboard/category/${category.id}`}
            className="hover:underline"
          >
            {category.name}
          </Link>

          <div>
            <button onClick={() => openModal("delete")}>
              <TrashIcon className="w-5" />
            </button>
          </div>
        </ItemRightCtaFrame>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {modal === "delete" && (
          <ConfirmModal
            callback={() =>
              action({ variant: "remove-category", id: category.id })
            }
            closeModal={closeModal}
            loading={isFetching}
            label={`Remove category '${category.name}'`}
          />
        )}
      </Modal>
    </>
  );
}
