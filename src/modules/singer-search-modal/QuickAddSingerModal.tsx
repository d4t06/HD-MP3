import {
  ModalHeader,
  Input,
  ModalContentWrapper,
  Label,
  ModalRef,
} from "@/components";
import { RefObject } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Button } from "@/pages/dashboard/_components";
import useAddSingerModal from "@/pages/dashboard/singer/_hooks/useAddSingerModal";

type Props = {
  modalRef: RefObject<ModalRef>;
  afterSubmit?: (s: Singer) => void;
  singerName?: string;
};

export default function QuickAddSingerModal({
  modalRef,
  afterSubmit,
  singerName,
}: Props) {
  const {
    handleSubmit,
    isFetching,
    isValidToSubmit,
    singerData,
    updateSingerData,
  } = useAddSingerModal({
    variant: "add",
    modalRef,
    afterSubmit,
    name: singerName,
  });

  const handleInput = (field: keyof Singer, value: string) => {
    updateSingerData({ ...singerData, [field]: value });
  };

  return (
    <ModalContentWrapper className="w-[450px]">
      <ModalHeader
        closeModal={() => modalRef.current?.close()}
        title={"Add singer"}
      />

      <div className="space-y-3 overflow-auto">
        <div className="space-y-1">
          <Label htmlFor="name">Singer name</Label>
          <Input
            id="name"
            value={singerData?.name || ""}
            onChange={(e) => handleInput("name", e.target.value)}
            placeholder="name..."
          />
        </div>
      </div>

      <div className="text-center mt-5">
        <Button
          disabled={!isValidToSubmit}
          loading={isFetching}
          onClick={() => isValidToSubmit && handleSubmit()}
        >
          <CheckIcon className="w-6" />
          <p className="text-white">Ok</p>
        </Button>
      </div>
    </ModalContentWrapper>
  );
}
