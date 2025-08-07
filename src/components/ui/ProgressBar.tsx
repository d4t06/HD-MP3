import { MouseEventHandler, RefObject } from "react";

type Props = {
  elelRef?: RefObject<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  progress?: number;
  bg?: string;
};

export default function ProgressBar({
  className = "h-[6px]",
  onClick,
  elelRef,
  bg = "var(--a-5-cl)",
}: Props) {
  return (
    <div
      onClick={onClick}
      ref={elelRef}
      style={{ background: bg }}
      className={`rounded-full w-full progress-line ${className}`}
    ></div>
  );
}
