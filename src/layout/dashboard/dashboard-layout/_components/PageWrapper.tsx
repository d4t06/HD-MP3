import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export default function PageWrapper({ children }: Props) {
  const location = useLocation();

  if (location.pathname.includes("lyric")) return children;

  return <div className="pb-[46px]">{children}</div>;
}
