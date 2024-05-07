import { ReactNode } from "react";
;
import { VariantProps, cva } from "class-variance-authority";

const popupVariant = cva("", {
  variants: {
    variant: {
      default: "py-[20px] px-[14px]",
      thin: "p-[6px]",
    },
  },
  defaultVariants: {
    variant: "default",
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
  variant,
}: Props) {
  const bgColorMap: Record<typeof color, string> = {
    black: "bg-[#292929]",
    container: theme.container,
    sidebar: theme.side_bar_bg,
  };

  return (
    <div
      className={`wrapper rounded-[6px]  ${
        theme.type === "light" ? "text-[#333]" : "text-white"
      } ${bgColorMap[color]} border-[1px] border-${theme.alpha} ${popupVariant({
        variant,
        className,
      })}`}
    >
      {children}
    </div>
  );
}
