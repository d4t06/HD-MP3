import { ReactNode } from "react";
interface Props {
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export default function Square({ children, className= "" }: Props) {
  return (
    <div className={`pt-[100%] relative rounded-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
