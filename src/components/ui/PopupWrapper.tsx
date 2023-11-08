import { ReactNode } from "react";
import { ThemeType } from "../../types";

type Props = {
   children: ReactNode;
   theme: ThemeType & {
      alpha: string;
   };
   classNames?: string;
};
export default function PopupWrapper({ children, theme, classNames }: Props) {
   return (
      <div
         className={`wrapper rounded-[6px] p-[20px] ${
            theme.type === "light" ? "text-[#333]" : "text-white"
         } ${theme.container} border-[1px] border-${theme.alpha} ${classNames || ""}`}
      >
         {children}
      </div>
   );
}
