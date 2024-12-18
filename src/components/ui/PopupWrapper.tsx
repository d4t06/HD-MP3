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
  color?: "sidebar" | "container" | "black";
}

export default function PopupWrapper({
  children,
  theme,
  className,
  color = "container",
  p,
  rounded,
}: Props) {
  const bgColorMap: Record<typeof color, string> = {
    black: "bg-[#292929]",
    container: theme.container,
    sidebar: theme.side_bar_bg,
  };

  return (
    <div
      className={`  ${theme.text_color} ${bgColorMap[color]} border-[1px] border-${
        theme.alpha
      } ${popupVariant({
        p,
        rounded,
        className,
      })}`}
    >
      {children}
    </div>
  );
}
