import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";

const Variant = cva("border-2 border-b-[6px] rounded-xl", {
  variants: {
    p: {
      "3": "p-3",
      clear: "",
    },
  },
  defaultVariants: {
    p: "3",
  },
});

type Props = VariantProps<typeof Variant> & {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Frame({ children, onClick, p, className = "" }: Props) {
  return (
    <div
      onClick={() => (onClick ? onClick() : {})}
      className={`${Variant({ p, className })} `}
    >
      {children}
    </div>
  );
}
