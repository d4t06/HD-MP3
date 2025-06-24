import { useThemeContext } from "@/stores";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function MenuWrapper({ children, className = "" }: Props) {
  const { theme } = useThemeContext();

  return (
    <div
      className={`rounded-md py-2 ${theme.modal_bg} text-white ${className}`}
    >
      {children}
    </div>
  );
}
