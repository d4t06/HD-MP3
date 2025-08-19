import { usePopoverContext } from "@/components";
import { useEffect, useRef } from "react";

type Props = {
  weekOptions: { value: string; label: string }[];
  submit: (i: number) => void;
  currentIndex: number;
};

export default function WeekList({ weekOptions, submit, currentIndex }: Props) {
  const {
    state: { isOpen },
  } = usePopoverContext();

  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (activeButtonRef.current) {
        activeButtonRef.current.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      }
    }
  }, [isOpen]);

  return (
    <>
      {weekOptions.map((option, i) => {
        const active = currentIndex === i;

        return (
          <button
            key={i}
            ref={active ? activeButtonRef : undefined}
            className={`${active ? `text-[--primary-cl] font-bold bg-[--a-5-cl]` : ""}`}
            onClick={() => submit(i)}
          >
            {option.label}
          </button>
        );
      })}
    </>
  );
}
