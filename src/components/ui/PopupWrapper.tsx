import { ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";

const popupVariant = cva("", {
  variants: {
    p: {
      3: "p-3",
      2: "p-2",
      1: "p-1",
      clear: "",
    },
    rounded: {
      xl: "rounded-xl",
      lg: "rounded-lg",
      md: "rounded-md",
      sm: "rounded-sm",
    },
  },
  defaultVariants: {
    p: 3,
    rounded: "xl",
  },
});

interface Props extends VariantProps<typeof popupVariant> {
  children: ReactNode;
  theme: ThemeType & {
    alpha: string;
  };
  className?: string;
  bg?: "primary" | "clear";
}

export default function PopupWrapper({
  children,
  bg = "primary",
  theme,
  className,
  p,
  rounded,
}: Props) {
  // const _bgColorMap: Record<typeof color, string> = {
  //   black: "bg-[#292929]",
  //   container: ``,
  //   sidebar: theme.side_bar_bg,
  // };

  return (
    <div
      className={` ${
        bg === "primary" ? theme.modal_bg : ""
      } text-white border-[#fff]/5 border-[1px]  ${popupVariant({
        p,
        rounded,
        className,
      })}`}
    >
      {children}
    </div>
  );
}
