import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalHeader({
   close,
   title,
}: {
   title: string;
   close: () => void;
}) {
   return (
      <div className="flex justify-between mb-3">
         <div className="text-xl leading-[2.2] font-playwriteCU">{title}</div>
         <button onClick={close} >
            <XMarkIcon className="w-7" />
         </button>
      </div>
   );
}
