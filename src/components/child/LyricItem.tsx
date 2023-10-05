import { useEffect, useRef } from "react";
import { ThemeType } from "../../types";

interface Props {
   children: string;
   active: boolean;
   done: boolean;
   firstTimeRender?: boolean;
   inUpload?: boolean;
   theme?: ThemeType & {alpha: string};
   className?: string
}

export default function LyricItem({
   children,
   active,
   done,
   firstTimeRender,
   inUpload,
   className
}: Props) {
   const lyricRef = useRef<HTMLLIElement>(null);

   // console.log('check firstTimeRender', firstTimeRender);
   

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
         className={`${className && className} py-[10px] max-[549px]:text-[24px] ${inUpload ? 'text-[16px]' : 'text-[40px]'} max-[549px]:text-center font-bold ${
            active ? "opacity-100" : ""
         } ${done ? "opacity-40" : ""} ${inUpload && 'flex pl-[20px]'}`}
      >
         {children}
         {(inUpload && active) && 
            <span className="ml-[10px] text-[16px]">(Next)</span>
         }
      </li>
   );
}
