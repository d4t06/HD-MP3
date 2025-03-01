import { ReactNode } from "react";
import simon_empty from "@/assets/simon_empty.png";

export default function NotFound({
  children,
  less,
  className = "",
}: {
  children?: ReactNode;
  less?: boolean;
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <img className="m-auto" src={simon_empty} alt="" />

      {!less && <p className="text-[16px] text-center">No result found, ¯\_(ツ)_/¯</p>}

      {children}
    </div>
  );
}
