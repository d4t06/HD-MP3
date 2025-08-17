import {
  ChooseImageModal,
  Image,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
} from "@/components";
import useCategoryBannerModal from "../_hooks/useCategoryBannerModal";
import { Button } from "@/pages/dashboard/_components";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useReadCopiedImage } from "@/hooks";

type Props = {
  closeModal: () => void;
};

export default function CategoryBannerModal({ closeModal }: Props) {
  const { imageUrl, setImageFile, handleSubmit, isFetching } =
    useCategoryBannerModal({
      closeModal,
    });

  useReadCopiedImage({ setImageFileFromParent: setImageFile });

  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <ModalContentWrapper className="w-[500px]">
        <ModalHeader closeModal={closeModal} title="Category banner" />

        <div className="overflow-auto">
          <div className="aspect-[16/4]">
            <Image className="h-full object-cover rounded-lg" src={imageUrl} />
          </div>

          <p className="mt-3">
            <Button
              className="p-1"
              size={"clear"}
              onClick={() => modalRef.current?.open()}
            >
              <PhotoIcon className="w-6" />
            </Button>
          </p>

          <p className="text-right mt-5">
            <Button loading={isFetching} onClick={handleSubmit}>
              Ok
            </Button>
          </p>
        </div>
      </ModalContentWrapper>

      <Modal variant="animation" ref={modalRef}>
        <ChooseImageModal
          modalRef={modalRef}
          setImageFile={setImageFile}
          title="Category banner"
        />
      </Modal>
    </>
  );
}
