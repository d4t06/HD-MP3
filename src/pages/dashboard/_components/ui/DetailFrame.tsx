import { ReactNode } from "react";
import Frame from "./Frame";

type Props = {
  children: ReactNode;
};

export default function DetailFrame({ children }: Props) {
  return (
    <Frame className="text-sm space-y-1 [&_span]:font-semibold [&_span]:text-[#666] [&_span]:mr-1">
      {children}
    </Frame>
  );
}
