import useNavigationButton from "./_hooks/useNavigationButton";
import { getDisable } from "@/utils/appHelpers";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type Props = {
  className?: string;
};

export default function NavigationButton({ className = "" }: Props) {
  const { behind, ahead, backward, forward } = useNavigationButton();

  return (
    <div className={`"flex space-x-3 [&>button]:p-1 ${className}`}>
      <button onClick={backward} className={`relative ${getDisable(!behind.length)}`}>
        <ArrowLeftIcon className="w-5" />
      </button>

      <button onClick={forward} className={`relative ${getDisable(!ahead.length)}`}>
        <ArrowRightIcon className="w-5" />

        {/* <div className="absolute left-full w-[200px] text-sm">
          {ahead.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
        </div> */}
      </button>
    </div>
  );
}
