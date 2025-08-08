import {
  Input,
  Label,
  LoadingOverlay,
  Modal,
  ModalContentWrapper,
  ModalRef,
} from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

type Props = {
  init: number;
  submit: (like: number, closeModal: () => void) => void;
  loading: boolean;
};

export default function LikeBtn({ init, submit, loading }: Props) {
  const [value, setValue] = useState(init);

  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <div className="flex items-center space-x-2">
        <span>Likes: </span> {abbreviateNumber(init)}
        <button onClick={() => modalRef.current?.open()}>
          <PencilIcon className="w-5" />
        </button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        <ModalContentWrapper>
          <div>
            <Label htmlFor="like">Like</Label>
            <Input
              value={value + "" || "0"}
              id="like"
              onChange={(e) => setValue(+e.target.value || 0)}
              type="number"
            />
          </div>

          <p className="text-right mt-5">
            <Button
              color="primary"
              onClick={() => {
                submit(value, modalRef.current!.close);
              }}
              disabled={loading}
              className={`rounded-full`}
            >
              Save
            </Button>
          </p>

          {loading && <LoadingOverlay />}
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
