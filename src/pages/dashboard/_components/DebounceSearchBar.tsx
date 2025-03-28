import { Dispatch, RefObject, SetStateAction } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Frame } from "./ui";
import { Input } from "@/components";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  inputRef?: RefObject<HTMLInputElement>
};
export default function DebounceSearchBar({ value, setValue, inputRef }: Props) {
  return (
    <Frame className="flex gap-2 justify-between items-center">
      <Input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} placeholder="..." />
      <Button
        onClick={() => (value ? setValue("") : {})}
        size={"clear"}
        className="p-2 flex-shrink-0"
      >
        {value ? <XMarkIcon className="w-6" /> : <MagnifyingGlassIcon className="w-6" />}
      </Button>
    </Frame>
  );
}
