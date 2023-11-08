import { Dispatch, SetStateAction } from "react";
import { Button } from "..";
import { ThemeType } from "../../types";

export default function ConfirmModal({
   loading,
   theme,
   callback,
   label,
   setOpenModal,
   buttonLabel,
   desc,
   className,
}: {
   callback: () => void;
   label?: string;
   desc?: string;
   buttonLabel?: string;
   loading: boolean;
   theme: ThemeType & { alpha: string };
   className?: string;
   setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
   return (
      <div
         className={`${className || "w-[400px]"} ${
            loading ? "opacity-60 pointer-events-none" : ""
         }`}
      >
         <h1 className="text-[20px] text-red-500 font-semibold">
            {label || "Wait a minute"}
         </h1>
         <p className=" text-[16px]">{desc}</p>

         <div className="flex gap-[10px] mt-[20px]">
            <Button
               isLoading={loading}
               className={` bg-${theme.alpha} hover:bg-red-500 rounded-full text-[14px]`}
               variant={"primary"}
               onClick={callback}
            >
               {buttonLabel || "Yes please"}
            </Button>
            <Button
               onClick={() => setOpenModal(false)}
               className={`${theme.content_bg} rounded-full text-[14px]`}
               variant={"primary"}
            >
               Close
            </Button>
         </div>
      </div>
   );
}
