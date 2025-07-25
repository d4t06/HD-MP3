import { ModalHeader, Input, ModalContentWrapper } from "@/components";
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
    setSinger({ ...singer, [field]: value.trim() });
  };

  const handleSubmit = async () => {
    const newSinger = await addSinger({
      data: singer,
    });

    if (newSinger && afterSubmit) afterSubmit(newSinger);

    closeModal();
  };

  const classes = {
    inputGroup: "gap-1",
    input: "p-2 bg-[#f1f1f1] border border-black/20 rounded-lg",
    label: "text-[#3f3f3f] text-lg",
  };

  return (
    <ModalContentWrapper className="w-[450px]">
      <ModalHeader closeModal={closeModal} title={"Add singer"} />

      <div className="space-y-3 overflow-auto">
        <div className={classes.inputGroup}>
          <label className={classes.label}>Customer name:</label>
          <Input
            value={singer.name}
            onChange={(e) => handleInput("name", e.target.value)}
            placeholder="Enter name..."
            className={classes.input}
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
