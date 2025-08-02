import { MouseEventHandler, RefObject } from "react";

type Props = {
  elelRef?: RefObject<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  progress?: number;
};

export default function ProgressBar({
  className = "h-[6px]",
  onClick,
  elelRef,
}: Props) {
  return (
    <div
      onClick={onClick}
      ref={elelRef}
      style={{ background: "var(--a-5-cl)" }}
      className={`rounded-full w-full progress-line ${className}`}
    ></div>
  );
}
