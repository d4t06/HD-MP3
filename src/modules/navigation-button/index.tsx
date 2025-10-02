import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import useNavigationButton from "./_hooks/useNavigationButton";
import { getClasses } from "@/utils/appHelpers";

type Props = {
  className?: string;
};

export default function NavigationButton({ className = "" }: Props) {
  const { behind, ahead, backward, forward } = useNavigationButton();

  return (
    <div
      className={`space-x-3 [&>button]:p-2 [&>button]:rounded-full [&>button]:bg-[--a-5-cl] ${className}`}
    >
      <button
        onClick={backward}
        className={`relative ${getClasses(!!behind.length, "hover:text-[--primary-cl]", "disable")} `}
      >
        <ArrowLeftIcon className="w-5" />
      </button>

      <button
        onClick={forward}
        className={`relative ${getClasses(!!ahead.length, "hover:text-[--primary-cl]", "disable")}`}
      >
        <ArrowRightIcon className="w-5" />
      </button>
    </div>
  );
}
