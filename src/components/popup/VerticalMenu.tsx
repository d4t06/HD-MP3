import { ReactNode } from "react";
import DismisPopupWrapper from "./DismisPopupWrapper";

type Props = {
  className?: string;
  children: ReactNode;
  dismiss?: boolean;
  cb?:() => void
};

export default function VertialMenu({
  children,
  dismiss = true,
  className = "",
  cb
}: Props) {
  const classes = {
    container:
      "hover:[&>*:not(div.absolute)]:bg-[--a-5-cl] [&>*]:px-3 [&>*]:py-2 [&>*]:w-full [&>*]:space-x-2 [&>*]:text-sm [&>*]:flex [&>*]:items-center [&_svg]:w-6  [&_svg]:flex-shrink-0 [&>*]:items-center [&_span]:font-semibold",
  };

  if (dismiss)
    return (
      <DismisPopupWrapper cb={cb} className={`${classes.container} ${className}`}>
        {children}
      </DismisPopupWrapper>
    );

  return <div className={classes.container}>{children}</div>;
}
