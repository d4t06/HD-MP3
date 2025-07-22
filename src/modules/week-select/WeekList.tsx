import { usePopoverContext } from "@/components";
import { useThemeContext } from "@/stores";
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
  const { theme } = useThemeContext();

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
            className={`${active ? `${theme.content_text} font-bold` : ""}`}
            onClick={() => submit(i)}
          >
            {option.label}
          </button>
        );
      })}
    </>
  );
}
