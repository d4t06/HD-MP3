import { Dispatch, FormEventHandler, SetStateAction } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Frame } from "@/components/dashboard";
import { Input } from "@/components";

type Props = {
  handleSubmit: FormEventHandler;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  className?: string;
};
export default function Searchbar({
  handleSubmit,
  setValue,
  value,
  className = "",
}: Props) {
  return (
    <Frame className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2 justify-between items-center">
        <div className="relative flex-grow flex items-center">
          <Input
            type="text"
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
        <Button type="submit" size={"clear"} className="p-2 flex-shrink-0">
          <MagnifyingGlassIcon className="w-6" />
        </Button>
      </form>
    </Frame>
  );
}
