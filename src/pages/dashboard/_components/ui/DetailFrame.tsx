import { ReactNode } from "react";
import Frame from "./Frame";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function DetailFrame({
  children,
  className = "space-y-1",
}: Props) {
  return (
    <Frame
      className={
        "text-sm  [&_span]:font-semibold [&_span]:text-[#666] [&_span]:mr-1 " +
        className
      }
    >
      {children}
    </Frame>
  );
}
