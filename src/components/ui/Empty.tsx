import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import Button from "./Button";

interface Props {
   className: string;
   label: string;
   onClick: () => void;
}

const Empty: FC<Props> = ({ className, label, onClick }) => {

   return (
      <div
      onClick={() => onClick()}
         className={
            className + " relative rounded-xl border group hover:text-indigo-600 cursor-pointer"
         }
      >
         <div className="flex flex-col justify-center absolute top-1/2 w-full -translate-y-1/2">
            <Button>
               <PlusCircleIcon className="h-16 w-16" />
            </Button>
            {label && <p className="mt-4 w-full text-xl text-center">{label}</p>}
         </div>
      </div>
   );
};

export default Empty;
