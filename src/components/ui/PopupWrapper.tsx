import { ReactNode } from "react";
import { ThemeType } from "../../types";

type Props = {
   children: ReactNode;
   theme: ThemeType & {
      alpha: string;
   };
   classNames?: string
};
export default function PopupWrapper({ children, theme, classNames }: Props) {
   return (
      <div
         className={`rounded  px-[20px] py-[10px] ${theme.type === "light" ? "text-[#333]" : "text-white"} ${theme.side_bar_bg} border-[1px] border-${theme.alpha} ${classNames}`}
      >{children}</div>
   );
}
