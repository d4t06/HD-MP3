import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ModalWrapper({ children }: Props) {
  return (
    <div className={`bg-white  overflow-hidden p-3 rounded-lg`}>
      {children}
    </div>
  );
}

export function ContentWrapper({ children, className = "w-[400px]" }: Props) {
  return <div className={`max-h-[80vh] max-w-[90vw] ${className}`}>{children}</div>;
}
