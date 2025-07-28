import { Image, ModalContentWrapper, ModalHeader } from "@/components";
import useCategoryBannerModal from "../_hooks/useCategoryBannerModal";
import { Button } from "@/pages/dashboard/_components";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef } from "react";

type Props = {
  closeModal: () => void;
};

export default function CategoryBannerModal({ closeModal }: Props) {
  const { imageUrl, setImageFile, handleSubmit, isFetching } =
    useCategoryBannerModal({
      closeModal,
    });

  const labelRef = useRef<HTMLLabelElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  return (
    <>
      <ModalContentWrapper className="w-[500px]">
        <label ref={labelRef} htmlFor="image-input" className="hidden"></label>
        <input
          onChange={handleInputChange}
          id="image-input"
          type="file"
          accept="image"
          className="hidden"
        />

        <ModalHeader closeModal={closeModal} title="Change order" />

        <div className="overflow-auto">
          <div className="aspect-[16/4]">
            <Image className="h-full object-cover rounded-lg" src={imageUrl} />
          </div>

          <p className="mt-3">
            <Button
              className="p-1"
              size={"clear"}
              onClick={() => labelRef.current?.click()}
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
    </>
  );
}
