import { Dispatch, FormEventHandler, RefObject, SetStateAction } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@/components";

type Props = {
  handleSubmit: FormEventHandler;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
};
export default function Searchbar({
  handleSubmit,
  setValue,
  value,
  className = "",
  inputRef,
}: Props) {
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!!value.trim()) handleSubmit(e);
  };

  return (
    <form
      onSubmit={submit}
      className={`p-2 bg-white/10 rounded-lg flex space-x-2 justify-between items-center ${className}`}
    >
      <div className="relative flex-grow flex items-center text-white">
        <Input
          type="text"
          className="bg-transparent border-none"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="..."
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
            }}
            className="absolute right-3"
          >
            <XMarkIcon className="w-6" />
          </button>
        )}
      </div>
      <Button type="submit" size={"clear"} rounded={'md'} className="p-2 flex-shrink-0 bg-white/20">
        <MagnifyingGlassIcon className="w-6" />
      </Button>
    </form>
  );
}
