import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
    className?:string
}

export default function Loading({className = ''}: Props) {
  return (
    <div className={`flex flex-grow items-center justify-center ${className}`}>
      <ArrowPathIcon className="w-6 animate-spin" />
    </div>
  );
}
