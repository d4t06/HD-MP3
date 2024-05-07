import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalHeader({
   close,
   title,
}: {
   title: string;
   close: () => void;
}) {
   return (
      <div className="flex justify-between mb-[15px]">
         <h1 className="text-[26px] font-semibold">{title}</h1>
         <button onClick={close} >
            <XMarkIcon className="w-[30px]" />
         </button>
      </div>
   );
}
