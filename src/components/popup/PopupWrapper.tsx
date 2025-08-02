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
      className={`rounded-md py-2 shadow-[0_0_6px_0_rgba(0,0,0,0.2)]  transition-[color] ${colorClasses}  ${className}`}
    >
      {children}
    </div>
  );
}
