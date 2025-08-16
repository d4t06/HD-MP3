import { RefObject, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  ChooseImageModal,
  Image,
  Input,
  Label,
  LoadingOverlay,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
} from "@/components";
import useAddCategoryModal from "../hooks/useAddCategoryModal";
import { Button } from "../../_components";

type BaseProps = {
  submit: (p: CategorySchema, imageFile?: File) => void;
  isLoading: boolean;
};

type Add = {
  variant: "add";
};

type Edit = {
  variant: "edit";
  category: Category;
};

export type AddCategoryModalProps = (Add | Edit) & {
  modalRef?: RefObject<ModalRef>;
};

export default function AddCategoryModal({
  isLoading,
  submit,
  ...props
}: BaseProps & AddCategoryModalProps) {
  const {
    imageFile,
    setImageFile,
    categoryData,
    updateData,
    isChanged,
    isChangeImage,
    inputRef,
    isValidToSubmit,
  } = useAddCategoryModal(props);

  const modalRef = useRef<ModalRef>(null);

  const handleAddPlaylist = async () => {
    if (!categoryData) return;
    if (!isChanged && !isChangeImage) return;

    //  it must be change something here!!
    submit(categoryData, imageFile);
  };

  if (!categoryData) return;

  return (
    <>
      <ModalContentWrapper className="w-[500px]">
        <ModalHeader
          closeModal={() => props.modalRef?.current?.close()}
          title={props.variant === "add" ? "Add category" : "Edit category"}
        />

        <div className="md:flex md:space-x-3">
          <div className="space-y-2.5">
            <div className="w-[200px] aspect-[5/3] rounded-lg overflow-hidden">
              <Image
                className="object-cover object-center h-full"
                blurHashEncode={categoryData.blurhash_encode}
                src={categoryData.image_url}
              />
            </div>

            <Button onClick={() => modalRef.current?.open()}>
              <PhotoIcon className="w-6" />
              <span>Change image</span>
            </Button>
          </div>

          <div className="mt-3 md:mt-0 flex-grow flex flex-col space-y-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                ref={inputRef}
                type="text"
                placeholder="name..."
                value={categoryData.name}
                onChange={(e) => updateData({ name: e.target.value })}
              />
            </div>
          </div>
        </div>
        <p className="text-right mt-5 md:mt-0">
          <Button
            loading={isLoading}
            onClick={handleAddPlaylist}
            disabled={!isValidToSubmit}
          >
            Save
          </Button>
        </p>

        {isLoading && <LoadingOverlay />}
      </ModalContentWrapper>

      <Modal variant="animation" ref={modalRef}>
        <ChooseImageModal
          modalRef={modalRef}
          setImageFile={setImageFile}
          title="Category iamge"
        />
      </Modal>
    </>
  );
}
