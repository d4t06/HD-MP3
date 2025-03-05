import { StopIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Button } from ".";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useSongSelectContext } from "@/stores/SongSelectContext";

type Base = {
  children: ReactNode;
};

type SelectAll = Base & {
  variant: "my-playlist" | "my-songs" | "others-playlist" | "dashboard-playlist";
  selectAll: () => void;
};

type NoSelectAll = Base & {
  variant: "home" | "dashboard-songs";
};

type Props = SelectAll | NoSelectAll;

export default function CheckedCta({ children, ...props }: Props) {
  const { isSelectAll, resetSelect } = useSongSelectContext();

  switch (props.variant) {
    case "home":
    case "dashboard-songs":
      return (
        <>
          {children}

          <Button onClick={resetSelect} className={`px-[5px] flex-shrink-0`}>
            <XMarkIcon className="w-[20px]" />
          </Button>
        </>
      );

    case "my-playlist":
    case "my-songs":
    case "dashboard-playlist":
    case "others-playlist":
      return (
        <>
          <button onClick={props.selectAll} className="ml-[10px]">
            {isSelectAll ? (
              <CheckIcon className="w-[20px]" />
            ) : (
              <StopIcon className="w-[20px]" />
            )}
          </button>

          {children}

          <Button onClick={resetSelect} className={`px-[5px] flex-shrink-0`}>
            <XMarkIcon className="w-[20px]" />
          </Button>
        </>
      );
  }
}
