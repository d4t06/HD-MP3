import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ModalWrapper({ children, className = "w-[400px]" }: Props) {
  return (
    <div
      className={`bg-white max-h-[80vh] overflow-hidden p-3 rounded-lg flex flex-col max-w-[90vw] ${className}`}
    >
      {children}
    </div>
  );
}
