import { ReactNode } from "react";
import DismisPopupWrapper from "./DismisPopupWrapper";

type Props = {
   className?: string;
   children: ReactNode;
};

export default function VertialMenu({
   children,
   className = "",
}: Props) {
   const classes = {
      container:
         "hover:[&>*:not(div.absolute)]:bg-white/5 [&>*]:px-3 [&>*]:py-2 [&>*]:w-full [&>*]:space-x-2 [&>*]:text-sm [&>*]:flex [&>*]:items-center [&_svg]:w-6  [&_svg]:flex-shrink-0 [&>*]:items-center [&_span]:font-medium",
   };

   return (
      <DismisPopupWrapper className={`${classes.container} ${className}`}>
         {children}
      </DismisPopupWrapper>
   );
}
