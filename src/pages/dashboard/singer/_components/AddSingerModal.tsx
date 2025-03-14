import { ChangeEvent } from "react";
import { useThemeContext } from "@/stores";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Image, Input, ModalHeader } from "@/components";
import useAddSingerModal, { UseAddSingerModalProps } from "../_hooks/useAddSingerModal";
import { inputClasses } from "@/components/ui/Input";
import { Button } from "../../_components";

export default function AddSingerModal(props: UseAddSingerModalProps) {
  const { theme } = useThemeContext();

  const {
    setImageFile,
    singerData,
    handleSubmit,
    isFetching,
    isValidToSubmit,
    updateSingerData,
    inputRef,
  } = useAddSingerModal(props);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setImageFile(e.target.files[0]);
  };

  if (!singerData) return;

  return (
    <div className="w-[700px] max-w-[calc(100vw-40px)]">
      <ModalHeader
        close={props.closeModal}
        title={props.variant === "add" ? "Add singer" : "Edit singer"}
      />

      <div className="flex space-x-3">
        <div className="space-y-2.5">
          <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
            <Image
              className="object-cover object-center h-full"
              blurHashEncode={singerData.blurhash_encode}
              src={singerData.image_url}
            />
          </div>
          <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            id="image_upload"
            className="hidden"
          />

          <div className="space-x-2 flex">
            <Button className={`${theme.content_bg}`} size={"clear"}>
              <label htmlFor="image_upload" className={`px-5 py-1 cursor-pointer `}>
                <PhotoIcon className="w-5" />
              </label>
            </Button>
          </div>
        </div>

        <div className="flex-grow flex flex-col space-y-2.5">
          <div className="space-y-1">
            <label htmlFor="name" className="opacity-[.8]">
              Name:
            </label>
            <Input
              ref={inputRef}
              type="text"
              id="name"
              placeholder=""
              value={singerData.name}
              onChange={(e) => updateSingerData({ name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="opacity-[.8]">
              Description:
            </label>

            <textarea
              placeholder="..."
              id="description"
              className={`${inputClasses} w-full bg-white/10 rounded-md min-h-[100px]`}
              value={singerData.description}
              onChange={(e) => updateSingerData({ description: e.target.value })}
            />
          </div>
        </div>
      </div>

      <p className="text-right mt-3">
        <Button
          loading={isFetching}
          color="primary"
          onClick={handleSubmit}
          disabled={!isValidToSubmit}
          className={`font-playwriteCU rounded-full`}
        >
          Save
        </Button>
      </p>
    </div>
  );
}
