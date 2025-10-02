import { ReactNode } from "react";
import DismisPopupWrapper from "./DismisPopupWrapper";

type Props = {
  className?: string;
  children: ReactNode;
  dismiss?: boolean;
  cb?: () => void;
  size?: string;
};

export default function VertialMenu({
  children,
  dismiss = true,
  className = "",
  size = "[&_svg]:w-5 [&>*]:text-[13px]",
  cb,
}: Props) {
  const classes = {
    container:
      "hover:[&>*:not(div.absolute)]:bg-[--a-5-cl] [&>*]:px-3 [&>*]:py-1.5 [&>*]:w-full [&>*]:space-x-2 [&>*]:flex [&>*]:items-center  [&_svg]:flex-shrink-0  [&_span]:font-bold",
  };

  if (dismiss)
    return (
      <DismisPopupWrapper
        cb={cb}
        className={`${classes.container} ${size} ${className}`}
      >
        {children}
      </DismisPopupWrapper>
    );

  return <div className={classes.container}>{children}</div>;
}
