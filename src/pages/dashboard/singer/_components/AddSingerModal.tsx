import ModalHeader from "@/components/ModalHeader";
import Input from "@/components/ui/Input";
import { useToastContext } from "@/stores";
import { initSingerObject } from "@/utils/factory";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useSingerAction } from "../../_hooks";
import { Button, ModalWrapper } from "../../_components";

type Props = {
  closeModal: () => void;
  afterSubmit?: (s: Singer) => void;
};

type Edit = {
  type: "edit";
  singer: Singer;
};

type Add = {
  type: "add";
  singerName?: string;
};

const initCustomer = (props: Add | Edit) => {
  if (props.type === "edit") {
    const { id, ...rest } = props.singer;
    return initSingerObject(rest);
  }

  return initSingerObject({
    name: props.singerName,
  });
};

export default function AddSingerModal({
  closeModal,
  afterSubmit,
  ...props
}: (Add | Edit) & Props) {
  const [singer, setSinger] = useState(initCustomer(props));

  const { action, isFetching } = useSingerAction();
  const { setErrorToast } = useToastContext();

  const ableToSubmit = singer.name;

  const handleInput = (field: keyof typeof singer, value: string) => {
    setSinger({ ...singer, [field]: value.trim() });
  };

  const handleSubmit = async () => {
    try {
      switch (props.type) {
        case "add":
          const newSinger = await action({
            type: "add",
            data: singer,
          });

          if (newSinger && afterSubmit) afterSubmit(newSinger);
          break;
        case "edit":
          await action({
            type: "edit",
            data: singer,
            id: props.singer.id,
          });
          break;
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      closeModal();
    }
  };

  const classes = {
    inputGroup: "gap-1",
    input: "p-2 bg-[#f1f1f1] border border-black/20 rounded-lg",
    label: "text-[#3f3f3f] text-lg",
  };

  const title = props.type === "edit" ? `Edit '${props.singer.name}'` : `Add singer`;

  return (
    <ModalWrapper className="w-[450px]">
      <ModalHeader close={closeModal} title={title} />

      <div className="space-y-3 pb-[40%] overflow-auto">
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
    </ModalWrapper>
  );
}
