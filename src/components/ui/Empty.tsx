import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import Button from "./Button";

interface Props {
  className: string;
  label: string;
  onClick: () => void;
}

const Empty: FC<Props> = ({ className, onClick }) => {
  return (
    <div
      onClick={() => onClick()}
      className={
        className +
        " relative rounded-xl border group hover:text-indigo-600 cursor-pointer"
      }
    >
      <Button className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ">
        <PlusCircleIcon className="h-[40px] w-[40px]" />
      </Button>
    </div>
  );
};

export default Empty;
