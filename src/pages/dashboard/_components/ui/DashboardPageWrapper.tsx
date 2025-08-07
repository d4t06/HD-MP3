import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function PageWrapper({ children, className = "" }: Props) {
  return <div className={"pb-46px " + className}>{children}</div>;
}
