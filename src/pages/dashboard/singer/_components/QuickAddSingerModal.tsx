import { ModalHeader, Input, ModalContentWrapper, Label } from "@/components";
import { initSingerObject } from "@/utils/factory";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import useQuickAddSinger from "../_hooks/useQuickAddSinger";

type Props = {
  closeModal: () => void;
  afterSubmit?: (s: Singer) => void;
  singerName?: string;
};

export default function QuickAddSingerModal({
  closeModal,
  afterSubmit,
  singerName,
}: Props) {
  const [singer, setSinger] = useState(
    initSingerObject({
      name: singerName,
    }),
  );

  const { addSinger, isFetching } = useQuickAddSinger();

  const ableToSubmit = singer.name;

  const handleInput = (field: keyof typeof singer, value: string) => {
    setSinger({ ...singer, [field]: value });
  };

  const handleSubmit = async () => {
    const newSinger = await addSinger({
      data: singer,
    });

    if (newSinger && afterSubmit) afterSubmit(newSinger);

    closeModal();
  };

  return (
    <ModalContentWrapper className="w-[450px]">
      <ModalHeader closeModal={closeModal} title={"Add singer"} />

      <div className="space-y-3 overflow-auto">
        <div className="space-y-1">
          <Label htmlFor="name">Singer name</Label>
          <Input
            id="name"
            value={singer.name}
            onChange={(e) => handleInput("name", e.target.value)}
            placeholder="name..."
          />
        </div>
      </div>

      <div className="text-center mt-5">
        <Button
          disabled={!ableToSubmit}
          loading={isFetching}
          onClick={() => ableToSubmit && handleSubmit()}
        >
          <CheckIcon className="w-6" />
          <p className="text-white">Ok</p>
        </Button>
      </div>
    </ModalContentWrapper>
  );
}
