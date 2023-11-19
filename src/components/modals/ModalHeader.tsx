import { Dispatch, SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalHeader({
   setIsOpenModal,
   title,
}: {
   title: string;
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
   return (
      <div className="flex justify-between mb-[15px]">
         <h1 className="text-[26px] font-semibold">{title}</h1>
         <button onClick={() => setIsOpenModal(false)} >
            <XMarkIcon className="w-[30px]" />
         </button>
      </div>
   );
}
