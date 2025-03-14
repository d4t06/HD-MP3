import { ChangeEvent } from "react";
import { useThemeContext } from "@/stores";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Image, Input, ModalHeader } from "@/components";
import useAddSingerModal, { UseAddSingerModalProps } from "../_hooks/useAddSingerModal";
import { inputClasses } from "@/components/ui/Input";
import { Button } from "../../_components";

type Props = UseAddSingerModalProps & {
  close: () => void;
};

export default function AddSingerModal({ close, ...props }: Props) {
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
        close={close}
        title={props.variant === "add" ? "Add playlist" : "Edit playlist"}
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
            accept="image/png, image/jpeg"
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
          <Input
            ref={inputRef}
            type="text"
            placeholder="name..."
            value={singerData.name}
            onChange={(e) => updateSingerData({ name: e.target.value })}
          />

          <textarea
            placeholder="..."
            className={`${inputClasses} bg-white/10 rounded-md`}
            value={singerData.description}
            onChange={(e) => updateSingerData({ description: e.target.value })}
          />
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
