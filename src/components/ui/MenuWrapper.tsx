import { useThemeContext } from "@/stores";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export function MenuWrapper({ children, className = "py-2" }: Props) {
  const { theme } = useThemeContext();

  return (
    <div className={`rounded-md ${theme.modal_bg} text-white ${className}`}>
      {children}
    </div>
  );
}

export function MenuList({
  children,
  className = "",
}: Props) {
  const classes = {
    container:
      "hover:[&>*:not(div.absolute)]:bg-white/5 [&>*]:px-3 [&>*]:py-2 [&>*]:w-full [&>*]:space-x-2 [&>*]:text-sm [&>*]:flex [&>*]:items-center",
  };

  return <div className={`${classes.container} ${className}`}>{children}</div>;
}
