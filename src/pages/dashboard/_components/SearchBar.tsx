import { Dispatch, FormEventHandler, RefObject, SetStateAction } from "react";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Frame } from "./ui";
import { Input } from "@/components";

type Props = {
  handleSubmit: FormEventHandler;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  loading?: boolean;
  whenClear?: () => void;
  frame?: boolean;
  place?: string;
  onFocus?: () => void;
  formRef?: RefObject<HTMLFormElement>
};
export default function Searchbar({
  handleSubmit,
  setValue,
  value,
  className = "",
  loading,
  whenClear,
  inputRef,
  frame = true,
  onFocus,
  formRef,
  place,
}: Props) {
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!!value.trim()) handleSubmit(e);
  };

  const content = (
    <form ref={formRef} onSubmit={submit} className="flex gap-2 justify-between items-center">
      <div className="relative flex-grow flex items-center">
        <Input
          type="text"
          ref={inputRef}
          className="font-semibold pr-10"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={onFocus}
          placeholder={place || "..."}

        />

        {value && (
          <button
            type="button"
            onClick={() => {
              if (!loading) {
                setValue("");
                whenClear && whenClear();
              }
            }}
            className="absolute right-3"
          >
            {loading ? (
              <ArrowPathIcon className="w-6 animate-spin" />
            ) : (
              <XMarkIcon className="w-6" />
            )}
          </button>
        )}
      </div>
      <Button type="submit" size={"clear"} className="p-2 flex-shrink-0">
        <MagnifyingGlassIcon className="w-6" />
      </Button>
    </form>
  );

  if (frame) return <Frame className={className}>{content}</Frame>;

  return content;
}
