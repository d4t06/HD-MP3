import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalHeader({
  closeModal,
  title,
}: {
  title: string;
  closeModal: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="text-xl w-[80%] font-bold text-[#333]">{title}</div>
      <button onClick={closeModal}>
        <XMarkIcon className="w-7" />
      </button>
    </div>
  );
}
