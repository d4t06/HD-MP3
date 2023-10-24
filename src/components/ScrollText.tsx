import { useRef } from "react";
import { Song } from "../types";
import useScrollText from "../hooks/useScrollText";

type Props = {
   label: string;
   autoScroll?: boolean;
   classNames: string;
   songInStore?: Song;
};

export default function ScrollText({
   label,
   classNames,
   autoScroll,
}: Props) {
   const textWrapper = useRef<HTMLDivElement>(null);
   const text = useRef<HTMLDivElement>(null);

   // use hooks
   useScrollText({text, textWrapper, autoScroll})

   return (
      <div ref={textWrapper} className="overflow-hidden scroll-smooth relative h-full">
         <div
            ref={text}
            className={`${classNames} absolute left-0 whitespace-nowrap line-clamp-1`}
         >
            {label || "..."}
         </div>
      </div>
   );
}
