import ModalHeader from "@/components/ModalHeader";
import Input from "@/components/ui/Input";
import { useToastContext } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import useGenreAction from "../../_hooks/useGenreAction";
import { Button, ModalWrapper } from "../../_components/ui";

type Props = {
  closeModal: () => void;
  afterSubmit?: (genre: Genre) => void;
};

type Edit = {
  type: "edit";
  genre: Genre;
};

type Add = {
  type: "add";
  genreName?: string;
};

export default function AddGenreModal({
  closeModal,
  afterSubmit,
  ...props
}: (Add | Edit) & Props) {
  const [name, setName] = useState(
    props.type === "add" ? props.genreName || "" : props.genre.name
  );

  const { action, isFetching } = useGenreAction();
  const { setErrorToast } = useToastContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const ableToSubmit = !!name;

  const handleSubmit = async () => {
    try {
      switch (props.type) {
        case "add":
          const newSinger = await action({
            type: "add",
            name,
          });

          if (newSinger && afterSubmit) afterSubmit(newSinger);
          break;
        case "edit":
          await action({
            type: "edit",
            name,
            id: props.genre.id,
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const title = props.type === "edit" ? `Edit '${props.genre.name}'` : `Add genre`;

  return (
    <ModalWrapper className="w-[450px]">
      <ModalHeader close={closeModal} title={title} />

      <div className="space-y-3 overflow-auto">
        <div className={classes.inputGroup}>
          <label className={classes.label}>Genre name:</label>
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
