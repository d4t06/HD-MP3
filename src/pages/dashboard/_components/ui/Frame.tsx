import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";

const Variant = cva("border-[2px] p-3 border-b-[6px] rounded-[14px]", {
  variants: {
    colors: {
      primary: "bg-white border-[#e1e1e1]",
      second: "bg-[#cee9b6] border-[#4a826f]",
      third: "bg-white border-[#4a826f]",
      clear: "",
    },
  },
  defaultVariants: {
    colors: "primary",
  },
});

type Props = VariantProps<typeof Variant> & {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Frame({
  children,
  onClick,
  colors,
  className = "",
}: Props) {
  return (
    <div
      onClick={() => (onClick ? onClick() : {})}
      className={`${Variant({ colors, className })} `}
    >
      {children}
    </div>
  );
}
