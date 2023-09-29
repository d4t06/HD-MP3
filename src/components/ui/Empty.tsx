import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import Button from "./Button";
import { ThemeType } from "../../types";

interface Props {
   className?: string;
   theme: ThemeType;
   onClick: () => void;
}

const Empty: FC<Props> = ({ className, onClick, theme }) => {
   return (
      <div
         onClick={() => onClick()}
         className={`${theme?.content_hover_text} ${className} relative rounded-xl border group cursor-pointer`}
      >
         <Button
            className={`absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] `}
         >
            <PlusCircleIcon className="w-[40px] max-[549px]:w-[30px]" />
         </Button>
      </div>
   );
};

export default Empty;
