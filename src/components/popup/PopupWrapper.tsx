import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  colorClasses?: string;
};

export default function PopupWrapper({
  children,
  className = "",
  colorClasses = "bg-[--popup-cl] text-[--text-cl]",
}: Props) {
  return (
    <div
      className={`rounded-md py-2 popup-shadow transition-[color] ${colorClasses}  ${className}`}
    >
      {children}
    </div>
  );
}
