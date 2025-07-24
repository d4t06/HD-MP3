import { ChangeEvent } from "react";
import { useThemeContext } from "@/stores";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Image,
  Input,
  ModalContentWrapper,
  ModalHeader,
} from "@/components";
import useAddCategoryModal from "../hooks/useAddCategoryModal";

type BaseProps = {
  closeModal: () => void;
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

export type AddCategoryModalProps = Add | Edit;

export default function AddCategoryModal({
  closeModal,
  isLoading,
  submit,
  ...props
}: BaseProps & AddCategoryModalProps) {
  const { theme } = useThemeContext();

  const {
    imageFile,
    setImageFile,
    categoryData,
    updatePlaylistData,
    isChanged,
    isChangeImage,
    inputRef,
    isValidToSubmit,
  } = useAddCategoryModal(props);

  const handleAddPlaylist = async () => {
    if (!categoryData) return;
    if (!isChanged && !isChangeImage) return;

    //  it must be change something here!!
    submit(categoryData, imageFile);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  if (!categoryData) return;

  return (
    <>
      <ModalContentWrapper className="w-[500px]">
        <ModalHeader
          close={closeModal}
          title={props.variant === "add" ? "Add category" : "Edit category"}
        />

        <div className="md:flex md:space-x-3">
          <div className="space-y-2.5">
            <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
              <Image
                className="object-cover object-center h-full"
                blurHashEncode={categoryData.blurhash_encode}
                src={categoryData.image_url}
              />
            </div>
            <input
              ref={inputRef}
              onChange={handleInputChange}
              type="file"
              multiple
              accept="image/png, image/jpeg"
              id="image_upload"
              className="hidden"
            />

            <div className="space-x-2 flex">
              <Button className={`${theme.content_bg}`} size={"clear"}>
                <label
                  htmlFor="image_upload"
                  className={`px-5 py-1 cursor-pointer `}
                >
                  <PhotoIcon className="w-5" />
                </label>
              </Button>
            </div>
          </div>

          <div className="mt-3 md:mt-0 flex-grow flex flex-col space-y-2.5">
            <div>
              <label htmlFor="name">Name</label>
              <Input
                className="bg-white/10"
                id="name"
                ref={inputRef}
                type="text"
                placeholder="name..."
                value={categoryData.name}
                onChange={(e) => updatePlaylistData({ name: e.target.value })}
              />
            </div>
          </div>
        </div>
        <p className="text-right mt-5 md:mt-0">
          <Button
            isLoading={isLoading}
            color="primary"
            onClick={handleAddPlaylist}
            disabled={!isValidToSubmit}
            className={`font-playwriteCU rounded-full`}
          >
            Save
          </Button>
        </p>
      </ModalContentWrapper>
    </>
  );
}
