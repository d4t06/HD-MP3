import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function PageWrapper({
  children,
  className = "space-y-10",
}: Props) {
  return (
    <div
      className={"min-h-[calc(100vh-127px-10px)] md:min-h-[unset] md:pt-10 " + className}
    >
      {children}
    </div>
  );
}
