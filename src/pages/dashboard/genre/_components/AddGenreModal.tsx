import {
  ModalContentWrapper,
  ModalHeader,
  Input,
  Switch,
  Label,
  LoadingOverlay,
} from "@/components";
import { useToastContext } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import useGenreAction from "../useGenreAction";
import { Button } from "../../_components";

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
  isMain?: boolean;
};

export default function AddGenreModal({
  closeModal,
  afterSubmit,
  ...props
}: (Add | Edit) & Props) {
  const [name, setName] = useState(
    props.type === "add" ? props.genreName || "" : props.genre.name,
  );

  const [isMain, setIsMain] = useState(
    props.type === "add" ? props.isMain || false : props.genre.is_main,
  );

  const { action, isFetching } = useGenreAction();
  const { setErrorToast } = useToastContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const ableToSubmit = !!name;

  const handleSubmit = async () => {
    try {
      if (!name.trim()) return;

      const newGenre: GenreSchema = {
        is_main: isMain,
        name: name,
      };

      switch (props.type) {
        case "add":
          const newSinger = await action({
            type: "add",
            genre: newGenre,
          });

          if (newSinger && afterSubmit) afterSubmit(newSinger);
          break;
        case "edit":
          await action({
            type: "edit",
            genre: newGenre,
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
    inputGroup: "space-y-1",
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const title =
    props.type === "edit" ? `Edit '${props.genre.name}'` : `Add genre`;

  return (
    <ModalContentWrapper className="w-[450px]">
      <ModalHeader closeModal={closeModal} title={title} />

      <div className="space-y-3 overflow-auto mt-5">
        <div className={classes.inputGroup}>
          <Label>Name</Label>
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name..."
          />
        </div>

        <div className="flex justify-between items-center">
          <Label>Main</Label>
          <Switch
            inActiveBg="bg-black/10"
            active={isMain}
            cb={() => setIsMain(!isMain)}
          />
        </div>
      </div>

      <div className="text-right mt-10">
        <Button
          disabled={!ableToSubmit}
          loading={isFetching}
          onClick={() => ableToSubmit && handleSubmit()}
        >
          <CheckIcon className="w-6" />
          <p className="text-white">Ok</p>
        </Button>
      </div>

      {isFetching && <LoadingOverlay />}
    </ModalContentWrapper>
  );
}
