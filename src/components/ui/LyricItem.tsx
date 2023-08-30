import { FC, useEffect, useRef } from "react";
import { themes } from "../../config/themes";

interface Props {
   children: string;
   active: boolean;
   done: boolean;
   firstTimeRender?: boolean;
   theme: string;
}

export default function LyricItem({
   children,
   active,
   done,
   firstTimeRender,
   theme
}: Props) {
   const lyricRef = useRef<HTMLLIElement>(null);

   const themeVariants = {
      "#4f46e5": "text-[#4f46e5]",
      "#5a7aa9": "text-[#5a7aa9]",
      "#cd1818": "text-[#cd1818]",
      "#91e159": "text-[#91e159]",
   };

   const key = theme as keyof typeof themeVariants;

   useEffect(() => {
      if (active) {
         const node = lyricRef.current as HTMLElement;

         node.scrollIntoView({
            behavior: firstTimeRender
               ? "instant"
               : "smooth",
            block: "center",
         });
      }
   }, [active]);

   return (
      <li
         ref={lyricRef}
         className={`py-[10px]  text-[40px] max-[549px]:text-[24px] max-[549px]:text-center font-bold ${
            active ? themeVariants[key] : ""
         } ${done ? "opacity-40" : ""}`}
      >
         {children}
      </li>
   );
}
