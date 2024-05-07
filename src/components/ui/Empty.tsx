import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import Button from "./Button";
;

interface Props {
   className?: string;
   theme: ThemeType & { alpha: string };
   onClick: () => void;
}

const Empty: FC<Props> = ({ className, onClick, theme }) => {

   
   return (
      <div
         className={`w-full rounded-[8px] border ${
            theme.type === "light" ? "border-[#333]" : "border-[#fff]"
         } relative`}
      >
         <div
            onClick={() => onClick()}
            className={`${theme?.content_hover_text} ${className} cursor-pointer`}
         >
            <Button className={`absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ${theme.type === "light" ? "text-[#333]" : "text-[#fff]"}`}>
               <PlusCircleIcon className="w-[40px] max-[549px]:w-[30px]" />
            </Button>
         </div>
      </div>
   );
};

export default Empty;
