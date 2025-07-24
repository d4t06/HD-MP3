import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalHeader({
  close,
  title,
}: {
  title: string;
  close: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="text-xl w-[80%] font-bold text-gray-600">{title}</div>
      <button onClick={close}>
        <XMarkIcon className="w-7" />
      </button>
    </div>
  );
}
