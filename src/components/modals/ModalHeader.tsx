import { XMarkIcon } from "@heroicons/react/20/solid";
import Title from "../ui/Title";

export default function ModalHeader({
  closeModal,
  title,
}: {
  title: string;
  closeModal: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-3">
      <Title title={title} />
      <button onClick={closeModal}>
        <XMarkIcon className="w-7" />
      </button>
    </div>
  );
}
