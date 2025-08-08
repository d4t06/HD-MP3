import { ChangeEvent, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  Image,
  Input,
  Label,
  ModalContentWrapper,
  ModalHeader,
} from "@/components";
import useAddSingerModal, {
  UseAddSingerModalProps,
} from "../_hooks/useAddSingerModal";
import { inputClasses } from "@/components/ui/Input";
import { Button } from "../../_components";

export default function AddSingerModal(props: UseAddSingerModalProps) {
  const labelRef = useRef<HTMLLabelElement>(null);

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
    <ModalContentWrapper className="w-[700px]">
      <ModalHeader
        closeModal={() => props.modalRef.current?.close()}
        title={props.variant === "add" ? "Add singer" : "Edit singer"}
      />

      <div className="flex-grow overflow-auto md:flex md:flex-[unset]">
        <div className="space-y-2.5">
          <div className="w-[200px] h-[200px] rounded-lg border overflow-hidden">
            <Image
              className="object-cover object-center h-full"
              blurHashEncode={singerData.blurhash_encode}
              src={singerData.image_url}
            />
          </div>
          <label
            ref={labelRef}
            htmlFor="image_upload"
            className="hidden"
          ></label>

          <input
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            id="image_upload"
            className="hidden"
          />

          <Button onClick={() => labelRef.current?.click()}>
            <PhotoIcon className="w-5" />
          </Button>
        </div>

        <div className="flex-grow flex flex-col mt-3  space-y-3 md:mt-0 md:ml-5">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
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
            <Label htmlFor="description">Description</Label>

            <textarea
              placeholder="..."
              id="description"
              className={`${inputClasses} rounded-md min-h-[100px]`}
              value={singerData.description}
              onChange={(e) =>
                updateSingerData({ description: e.target.value })
              }
            />
          </div>
{/* 
          {props.variant === "edit" && (
            <div className="space-y-1">
              <Label htmlFor="like">Like</Label>

              <Input
                id="like"
                type="number"
                value={singerData.like ? singerData.like + "" : "0"}
                onChange={(e) =>
                  updateSingerData({
                    like: isNaN(+e.target.value) ? 1 : +e.target.value,
                  })
                }
              />
            </div>
          )} */}
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
    </ModalContentWrapper>
  );
}
