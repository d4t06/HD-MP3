import { ReactNode } from "react";
interface Props {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export default function Square({ children }: Props) {
  return (
    <div className="pt-[100%] relative rounded-lg overflow-hidden">
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
